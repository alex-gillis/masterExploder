export function createHUD() {
    // Create Score Display
    const scoreElement = document.createElement('div');
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '10px';
    scoreElement.style.left = '10px';
    scoreElement.style.color = 'white';
    scoreElement.style.fontSize = '20px';
    scoreElement.textContent = `Score: 0`;
    document.body.appendChild(scoreElement);

    // Create Health Display
    const healthElement = document.createElement('div');
    healthElement.style.position = 'absolute';
    healthElement.style.top = '40px';
    healthElement.style.left = '10px';
    healthElement.style.color = 'white';
    healthElement.style.fontSize = '20px';
    healthElement.textContent = `Health: 3`;
    document.body.appendChild(healthElement);

    return { scoreElement, healthElement };
}

export function updateHUD(scoreElement, healthElement, score, health) {
    scoreElement.textContent = `Score: ${score}`;
    healthElement.textContent = `Health: ${health}`;
}
