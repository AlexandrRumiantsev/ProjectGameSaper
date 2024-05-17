// Получим корневую переменную
const root = document.querySelector('#root')

const Game = {
   start: function() {

        Menu.render(function() {
            // Вызываем базовые настройки игры
            Menu.setEventStart();
            Menu.setEventChangeLevel();
            Menu.setEventHelp();
        });
        

        Record.render();

   }
}

const Record = {
    render: function(){
        root.innerHTML += `
            <div id='record'>Таблица с рекордами</div>
        `
    }
}

function test (){
    alert('test')
}

const MainField = {
    startBombCount: 3,
    isLouse: false,
    render: function(gameLevel){

        MainField.isLouse = false
        console.log('render')
        // Вынесем в  отдельную переменную получение блока main
        const main = document.getElementById('main');

        if (main) {
            // Предварительно очистить 
            // Используем поле повторно
            this.create(main, () => {
                this.setFieldClick();
            }, gameLevel)
        } else {
            // Создаем поле в первый раз
            const mainBlock = document.createElement('div');
           
            mainBlock.setAttribute('id', 'main');
            // Стрелочная функция
            this.create(mainBlock, () => {
                console.log(this)
                this.setFieldClick();
                root.appendChild(mainBlock);
            }, gameLevel);
    
        }

        
    },
    setFieldClick: function() {
        // Ищем все поля field
        document.querySelectorAll('field')
    },
    create: function(block, callback, gameLevel){
        // Обнуляем блок с полями
        block.innerHTML = '';
        let bombCounter = 0;
        // Отрисовываем главное поле
        for(let i = 0; i < 25; i++) {
            console.log('Цикл', block)
            let isBomb = Math.floor(Math.random() * 2);

            const field = document.createElement('div');
            field.className = 'field';
            field.onclick = this.clickField

            if(isBomb == 1) {
                bombCounter++
                if(gameLevel >= bombCounter) {
                    field.dataset.bomb = isBomb
                } else {
                    field.dataset.bomb = 0
                }
               

            } else {
                field.dataset.bomb = 0
            }
  
            block.appendChild(field);
        }
        callback();
    },
    chechBomb: function(callback){
        // пройдемся по все элментам и откроем бомбы
        const fileds = document.querySelectorAll('.field');
        fileds.forEach((field) => {
            if(field.dataset.bomb == 1) {
                field.classList.add('bomb');
            }
        })
        callback()
    },
    clickField: function(){
        // Если мы уже проиграли, блокируем функцию
        if(MainField.isLouse) {
            return
        }
        // Понять, кликнули на бомбу или нет
        const isBomb = this.dataset.bomb == 1;

        if (isBomb) {
            
            document.getElementById('record').innerHTML += `<p>${document.getElementById('points').innerText}</p>`;
            document.getElementById('points').innerText = '0'
            MainField.isLouse = true

            MainField.chechBomb(
                () => {
                    setTimeout(() => {
                        // ДЗ TODO Заменить на попап
                        alert('Вы проиграли!');
                        // Очистить поле и начать заново
                        MainField.render(MainField.startBombCount)
                    }, 500)
                }
            )
          

        } else {
            this.classList.add('coin');
            MainField.addCoin()
        }
    },
    addCoin: function(){
        const nowPoint = document.getElementById('points').innerText;
        const newPoint = parseInt(nowPoint) + 1;
        document.getElementById('points').innerText = newPoint
    }
}

const Menu = {
    render: function(callback){
        root.innerHTML += `
            <div>
                <button id='start'>Старт</button>
                <button class='changeLevel' data-level='3'>
                    Изи
                </button>
                <button class='changeLevel' data-level='7'>
                    Лоу
                </button>
                <button class='changeLevel' data-level='15'>
                    Хай
                </button>
                <button id='help'>Глазик</button>
                <div id='points'>0</div>
            </div>
        `;
        setTimeout( function() {
            callback();
        }, 500)
       
    }, 
    setEventStart: function(){
        console.log(document.getElementById("start"))
        document.getElementById("start").onclick = function(){
            // alert('Нажали на старт игры')
            // Стартуем с первого уровня
            MainField.render(MainField.startBombCount)
        }
    },
    setEventChangeLevel: function(){

        // Узнаем размер коллекции (количество кнопок) и получаем саму коллекцию
        const buttonsChangeLevel = document.getElementsByClassName("changeLevel")
        const countButton = buttonsChangeLevel.length;
        
        
        for(let i = 0; i < countButton; i++) {
            buttonsChangeLevel[i].onclick = function(){
                //alert('Нажали на изменение уровня')
                MainField.render(this.dataset.level)
            }
        }
    },
    setEventHelp: function(){
        document.getElementById("help").onclick = function(){
            alert('Нажали на подсказку')
        }
    }
}

// Запустим игру
Game.start();