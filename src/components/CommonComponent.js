

import "../stylesheets/button.css"

export const ShadowComponent = (prop, ref) =>
    <div
        className='character-shadow'
        style={{
            position: 'absolute',
            width: prop.posInfo.w * 100 + '%',
            height: prop.posInfo.h * 100 + '%',
            left: prop.posInfo.l * 100 + '%',
            top: prop.posInfo.t * 100 + '%',
            pointerEvents: 'none',
            overflow: 'visible',
            opacity: prop.intensity

        }}

    >
    </div>