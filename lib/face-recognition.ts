import * as faceapi from 'face-api.js';

// Configuration
const MODELS_URL = '/models';

export async function loadModels() {
    try {
        await Promise.all([
            // Switch to SSD Mobilenet (Better for Group Photos & smaller faces)
            faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
        ]);
        console.log('Models loaded (SSD Mobilenet)');
    } catch (e) {
        console.error('Error loading models', e);
    }
}

export function euclideanDistance(desc1: Float32Array, desc2: Float32Array): number {
    return faceapi.euclideanDistance(desc1, desc2);
}

// Selfie: Keep using TinyFace is fine for self, but SSD is safer if user is far away.
// Let's use SSD for consistency and accuracy.
export async function getFaceDescriptor(imageElement: HTMLImageElement | HTMLVideoElement): Promise<Float32Array | undefined> {
    const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detection) {
        return undefined;
    }
    return detection.descriptor;
}

// Indexing: Use SSD Mobilenet with lower threshold to catch small faces in groups
export async function getAllFaces(imageElement: HTMLImageElement): Promise<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>>[]> {
    return await faceapi
        .detectAllFaces(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4, maxResults: 100 })) // 0.4 allows smaller/blurrier faces
        .withFaceLandmarks()
        .withFaceDescriptors();
}
