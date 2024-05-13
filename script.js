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
            <div>Таблица с рекордами</div>
        `
    }
}

const MainField = {
    render: function(gameLevel){
        console.log('render')
        // Вынесем в  отдельную переменную получение блока main
        const main = document.getElementById('main');

        if (main) {
            // Предварительно очистить 
            // Используем поле повторно
            this.create(main, () => {
                this.setFieldClick();
            })
        } else {
            // Создаем поле в первый раз
            const mainBlock = document.createElement('div');
           
            mainBlock.setAttribute('id', 'main');
            // Стрелочная функция
            this.create(mainBlock, () => {
                console.log(this)
                this.setFieldClick();
                root.appendChild(mainBlock);
            });
    
        }

        
    },
    setFieldClick: function() {
        // Ищем все поля field
        document.querySelectorAll('field')
    },
    create: function(block, callback){
        // Обнуляем блок с полями
        block.innerHTML = ''
        // Отрисовываем главное поле
        for(let i = 0; i < 25; i++) {
            console.log('Цикл', block)
            let isBomb = Math.floor(Math.random() * 2);

            const field = `
                <div class='field' data-bomb='${isBomb}'>Поле</div>
            `
            block.innerHTML += field
        }
        callback();
    }
}

const Menu = {
    render: function(callback){
        root.innerHTML += `
            <div>
                <button id='start'>Старт</button>
                <button class='changeLevel' data-level='1'>
                    Изи
                </button>
                <button class='changeLevel' data-level='2'>
                    Лоу
                </button>
                <button class='changeLevel' data-level='3'>
                    Хай
                </button>
                <button id='help'>Глазик</button>
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
            MainField.render(1)
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