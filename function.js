export function getCoords(leapPoint, frame, canvas) {
    const iBox = frame.interactionBox;
    const normalizedPoint = iBox.normalizePoint(leapPoint, true);

    return {
        x : normalizedPoint[0] * canvas.width,
        y : (1 - normalizedPoint[1]) * canvas.height
    };
}

const controller = new Leap.Controller();
controller.connect();

controller.on('frame', (f) => {
    frame = f;
});

export let frame;