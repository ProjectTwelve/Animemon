export function moveToLocation(player: mw.Player, direction: Vector) {

    // adjust by the direction of charater
    const r = player.character.localTransform.rotation.z;


    // -45 ~ 45
    if (r > -45 && r <= 45) {
        // do nothing
    }
    // 45 ~ 135
    if (r > 45 && r < 135) {
        const oldX = direction.x;
        const oldY = direction.y;

        direction.x = - oldY;
        direction.y = oldX;

    }
    // 135 ~ -135
    if (r >= 135 || r < -135) {
        direction.x = - direction.x;
        direction.y = - direction.y;

    }
    // -135 ~ -45
    if (r >= -135 && r < -45) {
        const oldX = direction.x;
        const oldY = direction.y;

        direction.x = oldY;
        direction.y = - oldX;
    }

    player.character.localTransform.position = new Vector(player.character.localTransform.position.x + direction.x, player.character.localTransform.position.y + direction.y, player.character.localTransform.position.z + direction.z)
}