import { CertificateAnalysisResponse, ManualVerificationRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const verificationService = {
    /**
     * Uploads a certificate file to the backend for verification.
     * @param file - The file object selected by the user
     */
    async uploadCertificate(file: File): Promise<CertificateAnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Upload failed. Please try again.');
        }

        return response.json();
    },

    /**
     * Manually verify a certificate using certificate ID and issuer URL
     * @param data - Manual verification request data
     */
    async manualVerify(data: ManualVerificationRequest): Promise<CertificateAnalysisResponse> {
        const response = await fetch(`${API_BASE_URL}/manual-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Manual verification failed. Please try again.');
        }

        return response.json();
    },
};
