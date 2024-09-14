document.addEventListener("DOMContentLoaded", function () {
    const logoContainer = document.getElementById('pong-logo-animation');
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "574");
    svg.setAttribute("height", "205");
    svg.setAttribute("viewBox", "0 0 574 205");
    svg.setAttribute("fill", "none");

    // Create linear gradient
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "gradient");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "100%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "0%");

    // Define gradient stops
    const gradientStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    gradientStop1.setAttribute("id", "gradientStop1");
    gradientStop1.setAttribute("offset", "0%");
    gradientStop1.setAttribute("style", "stop-opacity:1");

    const gradientStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    gradientStop2.setAttribute("id", "gradientStop2");
    gradientStop2.setAttribute("offset", "100%");
    gradientStop2.setAttribute("style", "stop-opacity:1");

    gradient.appendChild(gradientStop1);
    gradient.appendChild(gradientStop2);

    svg.appendChild(gradient);

    // Define SVG group for color animation
    const fillAnimationGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    fillAnimationGroup.setAttribute("fill", "url(#gradient)");
    fillAnimationGroup.setAttribute("class", "fill-animation");

    // SVG shapes (rectangles)
    const shapes = [
        { id: "letterN", x: 290, y: 35, width: 32, height: 134 },
        { id: "letterN", x: 393, y: 35, width: 32, height: 134 },
        { id: "letterN", x: 297.888, y: 55.4001, width: 31.5842, height: 148.803, transform: "rotate(-40.2332 297.888 55.4001)" },
        { id: "letterO", x: 149, y: 35, width: 32, height: 134 },
        { id: "letterO", x: 251, y: 35, width: 32, height: 134 },
        { id: "letterO", x: 149, y: 169, width: 32, height: 134, transform: "rotate(-90 149 169)" },
        { id: "letterO", x: 149, y: 67, width: 32, height: 134, transform: "rotate(-90 149 67)" },
        { id: "letterP", x: 39, y: 67, width: 32, height: 103, transform: "rotate(-90 39 67)" },
        { id: "letterP", x: 39, y: 137, width: 32, height: 103, transform: "rotate(-90 39 137)" },
        { id: "letterP", x: 142, y: 137, width: 32, height: 102, transform: "rotate(180 142 137)" },
        { id: "letterG", x: 471, y: 67, width: 32, height: 103, transform: "rotate(-90 471 67)" },
        { id: "letterG", x: 507, y: 118, width: 32, height: 67, transform: "rotate(-90 507 118)" },
        { id: "letterG", x: 471, y: 168, width: 32, height: 103, transform: "rotate(-90 471 168)" },
        { id: "letterG", x: 542, y: 86, width: 32, height: 82 },
        { id: "line1", x: 0, y: 66, width: 32, height: 134, stroke: "white", strokeWidth: 2, fill: "none" },
        { id: "line2", x: 432, y: 0, width: 32, height: 134, stroke: "white", strokeWidth: 2, fill: "none" },
        { id: "ball", x: 205, y: 113, width: 22, height: 22, fill: "white", transform: "rotate(-90 205 113)" }
    ];

    shapes.forEach(shape => {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        element.setAttribute("id", shape.id);
        element.setAttribute("x", shape.x);
        element.setAttribute("y", shape.y);
        element.setAttribute("width", shape.width);
        element.setAttribute("height", shape.height);
        if (shape.fill) {
            element.setAttribute("fill", shape.fill);
        }
        if (shape.stroke) {
            element.setAttribute("stroke", shape.stroke);
        }
        if (shape.strokeWidth) {
            element.setAttribute("stroke-width", shape.strokeWidth);
        }
        if (shape.transform) {
            element.setAttribute("transform", shape.transform);
        }
        fillAnimationGroup.appendChild(element);
    });

    svg.appendChild(fillAnimationGroup);
    logoContainer.appendChild(svg);

    // SVG animations
    const line1 = fillAnimationGroup.querySelector('#line1');
    const line2 = fillAnimationGroup.querySelector('#line2');
    const ball = fillAnimationGroup.querySelector('#ball');

    const moveLine1Animation = line1.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-30px)' }
    ], {
        duration: 1500,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });

    const moveLine2Animation = line2.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(32px)' }
    ], {
        duration: 1500,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });

    const bounceBallAnimation = ball.animate([
        { transform: 'translateY(-30px)' },
        { transform: 'translateY(-10px)' }
    ], {
        duration: 2000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });

    const colorAnimation = fillAnimationGroup.animate([
        { fill: '#FFD335' },
        { fill: '#FF4A4A' },
        { fill: '#00E7FD' },
        { fill: '#7100FE' }
    ], {
        duration: 5000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'linear'
    });
});
