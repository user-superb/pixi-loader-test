
/// INICIALIZAR CANVAS

const app = new PIXI.Application({
    width: 1366,
    height: 768,
    backgroundColor: 0x2b2b2b
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

document.querySelector('#game').appendChild(app.view);

/// Simplificacion

const loader = app.loader;
const recursos = loader.resources;

// Loader

loader.baseUrl = 'img';
loader.add('sheet','Player.json')
.add('map','scene.png')
.add('hud','hud.png');
loader.onError.add((event) => {console.log('Rompiste todo')});
loader.onComplete.add(doSheet); // Cuando termina de cargar todos los assets ejecutar la funcion "doSheet"
loader.load();

// It werks!!

/// CONFIGURACIONES

const anim_player_speed = 0.1;
const scale_player = 3;
const playerSpeed = { // Velocidad jugador
    x: 5,
    y: 5
}
const moveQuad = true; // Jugador se mueve en 4 direcciones?

/// VARIABLES

let player = new PIXI.Container();
let playerSprite;
let player_animations;

let mapSprite;
const keyPriority = [];
const input = {
    up: false,
    down: false,
    left: false,
    right: false
};

const fStates = {
    isMenuActive: false,
    isBattleActive: false
}

let hudSprite;
const hudSettings = {
    borde: 5,
    scale: scale_player,
    selectionAnimSpeed: -0.01
}

/// FUNCIONES

function quadMovement(event){ // Player se mueve en 4 direcciones
    if (fStates.isMenuActive) return;

    if (input.up == true && keyPriority[0] == 'up'){
        mapSprite.y += playerSpeed.y;
        playerSprite.play();
    }
    if (input.down == true && keyPriority[0] == 'down'){
        mapSprite.y -= playerSpeed.y;
        playerSprite.play();
    }
    if (input.left == true && keyPriority[0] == 'left'){
        mapSprite.x += playerSpeed.x;
        playerSprite.play();
    }
    if (input.right == true && keyPriority[0] == 'right'){
        mapSprite.x -= playerSpeed.x;
        playerSprite.play();
    }};

function octaMovement(event){ // Player se mueve en 8 direcciones
    if (input.up == true && !(keyPriority[0] == 'down')){ // Si input.x es verdadero y el primer elemento de keyPriority no sea su opuesto entonces
        mapSprite.y += playerSpeed.y;
    }
    if (input.down == true && !(keyPriority[0] == 'up')){
        mapSprite.y -= playerSpeed.y;
    }
    if (input.left == true && !(keyPriority[0] == 'right')){
        mapSprite.x += playerSpeed.x;
    }
    if (input.right == true && !(keyPriority[0] == 'left')){
        mapSprite.x -= playerSpeed.x;
    }};

function doSheet(event){ // Function - Create player - Fired when the loader finished loading all the assets

    // Create scene

    const mapTexture = PIXI.Texture.from('map');
    mapSprite = new PIXI.Sprite(mapTexture);
    mapSprite.scale.set(scale_player);
    mapSprite.position.set(20,-150);

    app.stage.addChild(mapSprite);

    // Set Animations

    player_animations = {
        up: new PIXI.AnimatedSprite(recursos.sheet.spritesheet.animations['up']),
        down: new PIXI.AnimatedSprite(recursos.sheet.spritesheet.animations['down']),
        left: new PIXI.AnimatedSprite(recursos.sheet.spritesheet.animations['left']),
        right: new PIXI.AnimatedSprite(recursos.sheet.spritesheet.animations['right'])
    };

    // Set Default Sprite

    playerSprite = new PIXI.AnimatedSprite(recursos.sheet.spritesheet.animations['default']);
    playerSprite.animationSpeed = anim_player_speed;
    playerSprite.scale.set(scale_player);
    playerSprite.anchor.set(0.5);
    playerSprite.autoUpdate = true; // Para que no se rompa la animacion cuando se utiliza el metodo .play() dentro del ticker

    // Add sprite to player container

    player.addChild(playerSprite);

    player.position.set(app.screen.width / 2, app.screen.height / 2); // Esto lo que hace es centrar al player en el medio.

    // NOTA: Esto pondria a player en las coordenadas X: 400 Y: 600,
    // pero el sprite en si se encuentra en las coordenadas X: 0 Y: 0,
    // ya que sus coordenadas son relativas al container player.
    // Lo mismo pasa con el player container, sus coordenadas son relativas al stage.

    // Set inputs and update sprite textures

    window.addEventListener('keydown',function(event){
        if (event.repeat == true) return; // Si se mantuvo pulsado la misma letra entonces no ejecuta las siguientes lineas!! 
                                        // Por alguna razon el ".repeat" funciona mal en Chrome, al cambiar de tecla bruscamente
                                        // capta la misma tecla dos veces, esto no sucede en Firefox.

        switch(event.code){
            case 'ArrowUp':{
                input.up = true;
                !keyPriority.includes('up') && keyPriority.unshift('up'); // Si el Array keyPriority no incluye a 'x' entonces agregar al principio 'o'
                playerSprite.textures = player_animations.up.textures;
                break;
            }
            case 'ArrowDown':{
                input.down = true;
                !keyPriority.includes('down') && keyPriority.unshift('down');
                playerSprite.textures = player_animations.down.textures;
                break;
            }
            case 'ArrowLeft':{
                input.left = true;
                !keyPriority.includes('left') && keyPriority.unshift('left');
                playerSprite.textures = player_animations.left.textures;
                break;
            }
            case 'ArrowRight':{
                input.right = true;
                !keyPriority.includes('right') && keyPriority.unshift('right');
                playerSprite.textures = player_animations.right.textures;
                break;
            }

            case 'KeyX':{
                hud.visible = !(hud.visible);       // } Van a ir alternando entre false y true
                fStates.isMenuActive = !(fStates.isMenuActive); // } 
                break;
            }
        }

        // console.log(keyPriority)
    });

    window.addEventListener('keyup',function(event){ // Recordar que si la funcion se ejecuta entonces fue porque se dejo de presionar una tecla
        switch(event.code){
            case 'ArrowUp':{
                input.up = false;
                keyPriority.splice(keyPriority.indexOf('up'),1); // Elimina el valor 'x' de keyPriority
                break;
            }
            case 'ArrowDown':{
                input.down = false;
                keyPriority.splice(keyPriority.indexOf('down'),1);
                break;
            }
            case 'ArrowLeft':{
                input.left = false;
                keyPriority.splice(keyPriority.indexOf('left'),1);
                break;
            }
            case 'ArrowRight':{
                input.right = false;
                keyPriority.splice(keyPriority.indexOf('right'),1);
                break;
            }
        }

        if (keyPriority.length == 0){playerSprite.stop()} // Si keyPriority esta vacio (osea que no hay ninguna tecla activa), parar animacion
        else if (keyPriority.length !== 0){ // sino, si keyPriority no esta vacio entonces
            playerSprite.textures = player_animations[keyPriority[0]].textures; // Cambiar el sprite animado al keyPriority actual
            playerSprite.play(); // Play sprite animation
        }
    // console.log(keyPriority)
    });

    // Set ticker - Player Movement

    if (moveQuad == true){
        app.ticker.add(quadMovement);
    } else if (moveQuad == false){
        app.ticker.add(octaMovement);
    } else {console.log('La variable moveQuad tiene un valor incorrecto')}

    // Set ticker - Update coords
    function showCoords(){
        app.ticker.add((event) => {
            document.querySelector('#X').textContent = `X: ${(mapSprite.x * -1)}`;
            document.querySelector('#Y').textContent = `Y: ${(mapSprite.y * -1)}`;
        })
    } showCoords();
    
    // Spawn Player

    app.stage.addChild(player);

    // Draw hud

    const hud = new PIXI.Container();

    const hudTexture = PIXI.Texture.from('hud');
    hudSprite = new PIXI.Sprite(hudTexture);
    hudSprite.scale.set(hudSettings.scale);
    hudSprite.x += hudSettings.borde; // } Le agregan un espacio para que no esten pegado al borde
    hudSprite.y += hudSettings.borde; // }

    hud.visible = false; // No es visible por defecto

    hud.addChild(hudSprite);

    app.stage.addChild(hud); // Siempre tiene que ser lo ultimo en renderizarse

    //
};