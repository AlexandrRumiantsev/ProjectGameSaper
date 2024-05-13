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

        // Проверяем mainBlock на существование

        // ДЗ Оптимизировать данный метод

        if (document.getElementById('main')) {
            //  Предварительно очистить 
            document.getElementById('main').innerHTML = `
                <div>
                    Главное поле
                    Уровень игры: ${gameLevel}
                </div>
            `;

        } else {
            const mainBlock = document.createElement('div')

            mainBlock.innerHTML = `
                <div>
                    Главное поле
                    Уровень игры: ${gameLevel}
                </div>
            `;

            mainBlock.setAttribute('id', 'main')

            root.appendChild(mainBlock);
        }
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