class WebXRAR {
    constructor() {
        // Core components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.xrSession = null;
        this.xrReferenceSpace = null;
        this.hitTestSource = null;
        this.model = null;
        this.modelPlaced = false;

        // UI elements
        this.startButton = document.getElementById('startButton');
        this.ui = document.getElementById('ui');
        this.status = document.getElementById('status');
        this.canvas = document.getElementById('canvas');

        this.init();
    }

    async init() {
        // Check WebXR support
        if (!navigator.xr) {
            this.showError('WebXR not supported on this device');
            return;
        }

        // Check for immersive AR support
        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!isSupported) {
            this.showError('AR not supported on this device');
            return;
        }

        // Set up Three.js scene
        this.setupThreeJS();

        // Load the model
        await this.loadModel();

        // Enable start button
        this.startButton.disabled = false;
        this.startButton.addEventListener('click', () => this.startAR());

        console.log('WebXR AR initialized successfully');
    }

    setupThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera (WebXR will control this)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.xr.enabled = true;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    async loadModel() {
        try {
            this.showStatus('Loading 3D model...');

            const loader = new THREE.GLTFLoader();
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    './files/Avocado.glb', // Make sure this file exists!
                    resolve,
                    undefined,
                    reject
                );
            });

            this.model = gltf.scene;

            // Scale and position the model appropriately
            this.model.scale.setScalar(0.5); // Adjust scale as needed

            console.log('Model loaded successfully');
            this.showStatus('Model loaded! Ready to start AR');

        } catch (error) {
            console.error('Error loading model:', error);
            this.showError('Failed to load 3D model. Make sure your-model.glb exists in the project folder.');
        }
    }

    async startAR() {
        try {
            this.showStatus('Starting AR session...');

            // Request AR session with hit-test feature
            this.xrSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test']
            });

            // Set up the session
            await this.renderer.xr.setSession(this.xrSession);

            // Get reference space
            this.xrReferenceSpace = await this.xrSession.requestReferenceSpace('local-floor');

            // Set up hit testing
            const viewerSpace = await this.xrSession.requestReferenceSpace('viewer');
            this.hitTestSource = await this.xrSession.requestHitTestSource({
                space: viewerSpace
            });

            // Hide UI
            this.ui.classList.add('hidden');
            this.showStatus('Tap the screen to place your model');

            // Start render loop
            this.renderer.setAnimationLoop((timestamp, frame) => {
                this.onXRFrame(timestamp, frame);
            });

            // Handle session end
            this.xrSession.addEventListener('end', () => {
                this.onSessionEnd();
            });

            // Handle screen taps for placing model
            this.canvas.addEventListener('click', (event) => {
                this.onScreenTap(event);
            });

        } catch (error) {
            console.error('Failed to start AR:', error);
            this.showError('Failed to start AR session: ' + error.message);
        }
    }

    onXRFrame(timestamp, frame) {
        if (!frame) return;

        const session = frame.session;
        const pose = frame.getViewerPose(this.xrReferenceSpace);

        if (pose) {
            // Render the scene
            this.renderer.render(this.scene, this.camera);
        }
    }

    onScreenTap(event) {
        if (!this.model || this.modelPlaced) return;

        // Get the current frame
        const frame = this.renderer.xr.getFrame();
        if (!frame || !this.hitTestSource) return;

        // Perform hit test
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);

        if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(this.xrReferenceSpace);

            if (pose) {
                // Clone the model and position it
                const modelClone = this.model.clone();
                modelClone.position.copy(pose.transform.position);
                modelClone.quaternion.copy(pose.transform.orientation);

                // Add to scene
                this.scene.add(modelClone);
                this.modelPlaced = true;

                this.showStatus('Model placed! You can move around to view it from different angles');

                // Hide status after a few seconds
                setTimeout(() => {
                    this.status.style.display = 'none';
                }, 3000);
            }
        }
    }

    onSessionEnd() {
        this.xrSession = null;
        this.hitTestSource = null;
        this.modelPlaced = false;

        // Clear any placed models
        const modelsToRemove = [];
        this.scene.traverse((child) => {
            if (child.userData.isPlaced) {
                modelsToRemove.push(child);
            }
        });
        modelsToRemove.forEach(model => this.scene.remove(model));

        // Show UI again
        this.ui.classList.remove('hidden');
        this.status.style.display = 'none';

        console.log('AR session ended');
    }

    showStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = type === 'error' ? 'error' : type === 'success' ? 'success' : '';
        this.status.style.display = 'block';
    }

    showError(message) {
        this.showStatus(message, 'error');
        this.startButton.disabled = true;
        this.startButton.textContent = 'AR Not Available';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WebXRAR();
});