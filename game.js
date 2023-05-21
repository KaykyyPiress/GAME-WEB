/*
  Autor: Kayky
  Descrição: jogo da nave Zin
*/

document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('audio-player');
    
    document.addEventListener('click', function() {
      audio.play();
    });
  });  

// Obtendo referência para o elemento canvas
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// Posição inicial do jogador
var playerX = canvas.width / 2;
var playerY = canvas.height - 30;

// Velocidade de movimento do jogador
var velocidade_jogador = 3;

// Tamanho dos obstáculos
var largura_obstaculo = 8;
var altura_obstaculo = 8;

// Velocidade de movimento dos obstáculos
var velocidade_obstaculo = 1.5;

// Array para armazenar os obstáculos
var obstaculos = [];

// Variável para controlar a pontuação
var pontos = 0;

// Carregar a imagem dos obstáculos
var imagem_obstaculo = new Image();
imagem_obstaculo.src = 'img/vagalume.gif';

// Carregar a imagem do player
var imagem_player = new Image();
imagem_player.src = 'img/nav.png';

// Variável para controlar se o jogo está em execução
var jogo_rodando = false;

// Referência para o botão de início
var startButton = document.getElementById("startButton");

// Referência para o elemento de pontuação
var scoreText = document.getElementById("scoreText");

// Variáveis para controle das teclas pressionadas
var tecla_a = false;
var tecla_d = false;
var tecla_w = false;
var tecla_s = false;

// Variáveis para controle do especial
var especial = false;
var shieldCooldown = 0;
var duracao_especial = 3050; // 3 segundos

// Função para iniciar o jogo quando o botão for clicado
function startGame() {
    startButton.style.display = "none"; // Oculta o botão de início
    jogo_rodando = true;
    cria_obstaculo();
    gameLoop();
}

// Event listener para o clique no botão de início
startButton.addEventListener("click", startGame);

// Função para desenhar o jogador
function desenha_jogador() {
    context.drawImage(imagem_player, playerX, playerY, 50, 50);
}

// Função para desenhar os obstáculos
function desenha_obstaculo() {
    for (var i = 0; i < obstaculos.length; i++) {
        var obstacle = obstaculos[i];
        context.drawImage(imagem_obstaculo, obstacle.x, obstacle.y, largura_obstaculo, altura_obstaculo);
    }
}

// Função para atualizar a posição do jogador
function posicao_jogador() {
    if (tecla_a && playerX > 0) {
        playerX -= velocidade_jogador;
    }
    if (tecla_d && playerX < canvas.width - 50) {
        playerX += velocidade_jogador;
    }
    if (tecla_w && playerY > 0) {
        playerY -= velocidade_jogador;
    }
    if (tecla_s && playerY < canvas.height - 50) {
        playerY += velocidade_jogador;
    }
}

// Função para verificar colisão entre dois retângulos
function colisao_teste(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Função para atualizar a posição dos obstáculos
function posicao_obstaculos() {
    for (var i = 0; i < obstaculos.length; i++) {
        var obstacle = obstaculos[i];
        obstacle.y += velocidade_obstaculo;

        // Define os retângulos de colisão do jogador e do obstáculo
        var playerRect = {
            x: playerX + 8, // Adicione uma margem de 10 pixels à esquerda e à direita do jogador
            y: playerY + 8, // Adicione uma margem de 10 pixels acima e abaixo do jogador
            width: 30, // Reduza a largura do retângulo do jogador
            height: 30 // Reduza a altura do retângulo do jogador
        };
        var obstacleRect = {
            x: obstacle.x,
            y: obstacle.y,
            width: largura_obstaculo,
            height: altura_obstaculo
        };

        // Verifica se houve colisão entre os retângulos
        if (colisao_teste(playerRect, obstacleRect)) {
            // Game over
            alert("EXTERMINADO! Pontuação: " + pontos);
            document.location.reload();
        }

        // Verifica se o obstáculo saiu da tela e o remove
        if (obstacle.y > canvas.height) {
            obstaculos.splice(i, 1);
            pontos++;
            atualiza_pontuacao();
        }
    }
}


// Função para gerar um novo obstáculo
function cria_obstaculo() {
    var x = Math.random() * (canvas.width - largura_obstaculo);
    var y = 0;
    obstaculos.push({ x: x, y: y });

    // Reduz o intervalo entre a geração de obstáculos ao passar do tempo
    velocidade_obstaculo += 0.06;

    // Agenda a próxima geração de obstáculo
    setTimeout(cria_obstaculo, 1000 / velocidade_obstaculo);
}

// Função para limpar o canvas
function limpa_canvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Função para atualizar o texto de pontuação
function atualiza_pontuacao() {
    scoreText.textContent = "Pontuação: " + pontos;
}

// Função para ativar o especial
function ativa_especial() {
    if (!especial && shieldCooldown <= 0) {
        especial = true;
        shieldCooldown = 10; // Tempo de recarga do escudo em segundos

        // Reduz a velocidade dos obstáculos enquanto o escudo está ativo
        velocidade_obstaculo /= 2;

        // Aguarda o tempo de duração do escudo e desativa-o
        setTimeout(desativa_especial, duracao_especial);
    }
}

// Função para desativar o escudo
function desativa_especial() {
    especial = false;
    // Restaura a velocidade original dos obstáculos
    velocidade_obstaculo *= 2;
}

// Função para atualizar o tempo de recarga do escudo
function tempo_recarga_especial() {
    if (shieldCooldown > 0) {
        shieldCooldown -= 1 / 60; // Subtrai o tempo em segundos desde o último quadro
        shieldCooldown = Math.max(0, shieldCooldown); // Garante que o tempo de recarga não seja negativo
    }
}

// Função para desenhar o tempo de recarga do escudo
function mostra_tempo_recarga() {
    if (shieldCooldown > 0) {
        var cooldownText = "Especial disponível em: " + shieldCooldown.toFixed(1) + "s";
        context.fillStyle = "white";
        context.font = "16px Arial";
        context.fillText(cooldownText, 10, 30);
    }
}

function gameLoop() {
    if (!jogo_rodando) {
        return; // Se o jogo não estiver em execução, retorna
    }

    limpa_canvas();
    desenha_jogador();
    desenha_obstaculo();
    posicao_jogador();
    posicao_obstaculos();
    tempo_recarga_especial(); // Atualiza o tempo de recarga do escudo
    mostra_tempo_recarga(); // Desenha o tempo de recarga do escudo
    requestAnimationFrame(gameLoop);
}

// Event listeners para capturar as teclas pressionadas
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Função para tratar as teclas pressionadas
function keyDownHandler(event) {
    if (event.keyCode === 65) {
        tecla_a = true;
    }
    if (event.keyCode === 68) {
        tecla_d = true;
    }
    if (event.keyCode === 87) {
        tecla_w = true;
    }
    if (event.keyCode === 83) {
        tecla_s = true;
    }
    if (event.keyCode === 70 && shieldCooldown === 0 && !especial) {
        ativa_especial();
    }
}

// Função para tratar as teclas liberadas
function keyUpHandler(event) {
    if (event.keyCode === 65) {
        tecla_a = false;
    }
    if (event.keyCode === 68) {
        tecla_d = false;
    }
    if (event.keyCode === 87) {
        tecla_w = false;
    }
    if (event.keyCode === 83) {
        tecla_s = false;
    }
}

// Função para iniciar o jogo quando a página for carregada
function comecar_game() {
    atualiza_pontuacao();
}

// Inicializa o jogo
comecar_game();