export function createHUD() {
    // Create Score Display
    const scoreElement = document.createElement('div');
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '10px';
    scoreElement.style.left = '10px';
    scoreElement.style.color = 'white';
    scoreElement.style.fontSize = '20px';
    scoreElement.textContent = ``;
    document.body.appendChild(scoreElement);

    // Create Health Display
    const healthElement = document.createElement('div');
    healthElement.style.position = 'absolute';
    healthElement.style.top = '40px';
    healthElement.style.left = '10px';
    healthElement.style.color = 'white';
    healthElement.style.fontSize = '20px';
    healthElement.textContent = ``;
    document.body.appendChild(healthElement);

    // Create Health Display
    const waveElement = document.createElement('div');
    waveElement.style.position = 'absolute';
    waveElement.style.top = '70px';
    waveElement.style.left = '10px';
    waveElement.style.color = 'white';
    waveElement.style.fontSize = '20px';
    waveElement.textContent = ``;
    document.body.appendChild(waveElement);

    return { scoreElement, healthElement, waveElement };
}

export function updateHUD(scoreElement, healthElement, waveElement, score, health, wave) {
    scoreElement.textContent = `Score: ${score}`;
    healthElement.textContent = `Health: ${health}`;
    waveElement.textContent = `Wave: ${wave}`;
}
