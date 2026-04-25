// Interface upon our scene (HUD)
import React from 'react';
import { useCharacterStore } from '../store/useCharacterStore.js';

const panelStyle = {
    background: 'rgba(0, 14, 85, 0.5)',
    border: '2px solid #272f82',
    borderRadius: '10px',
    padding: '12px 18px',
    backdropFilter: 'blur(4px)'
};

export default function GameUi() {
    const cameraMode = useCharacterStore((s) => s.cameraMode);

    return(
        <div>
            <div
                style={{
                    ...panelStyle,
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    fontSize: 12,
                    color: '#000000',
                    lineHeight: 1.7
                }}
            >
                <span>V</span> - change camera mode
            </div>
        </div>
    );
};