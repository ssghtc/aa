'use client';

import React from 'react';

/**
 * HostingRenewalPopup component
 * Displays a premium-looking modal overlay when hosting needs renewal.
 */
export default function HostingRenewalPopup() {
    // In a real application, you might want to control this with state or a condition
    // For this request, we'll assume it should be shown.

    return (
        <div className="hosting-overlay">
            <div className="hosting-content">
                <div className="hosting-icon">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                    </svg>
                </div>
                <h1>Service Temporarily Unavailable</h1>
                <p>
                    Your hosting subscription has expired. Please renew your hosting plan to continue accessing your services and data.
                </p>
                <button className="renew-button" onClick={() => window.location.href = '#'}>
                    Renew Subscription Now
                </button>
            </div>
        </div>
    );
}
