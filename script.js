// Получим корневую переменную
const root = document.querySelector('#root')

/**
 * Основной объект игры
 * Отвечает за всю игру, ее работу и действия, которые в ней есть
 * 
 * Функции объекта:
 * - start
 */
const Game = {
    /**
     * Функция start
     * Задействует формирование (настройка всей игры)
     */
   start: function() {

        // 1 - Задействует функцию render, для формирования и отрисовки (рендера), блока меню
        Menu.render(function() {
            // 3 - Вызываем базовые настройки игры

            // 3.1 - Устанавливаем событие на кнопку "Старт"
            Menu.setEventStart();
            // 3.2 - Устанавливаем событие на 3 кнопки для смены уровня
            Menu.setEventChangeLevel();
            // 3.3 - Устанавливаем событие на кнопку подсказки
            Menu.setEventHelp();
        });
        
        // 2 - Задействует функцию render из объекта Record, для формирования таблицы рекордов
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

/**
 * MainField Объект игрового поля, отвечает за логику игры, на игровом поле.
 * 
 * Атрибуты:
 * - startBombCount - записано базовое количество бомб
 * - isLouse - флаг, который показывает, что мы проиграли игру, нужен для того чтобы блокировать дальнейшую игру
 *
 * Функции:
 * render,
 * setFieldClick,
 * create
 * chechBomb
 * clickField
 * addCoin
 */
const MainField = {
    startBombCount: 3,
    isLouse: false,

    /**
     * Функция отвечает за начало формирования рендера html всего игрового поля
     * 
     * Параметры:
     * 1. gameLevel - уровень сложности игры (кол-во бомб)
     */
    render: function(gameLevel){
        // Принудительно задаем isLouse = false, что означает, что игра не проиграна
        // Тут она только начинается
        MainField.isLouse = false
        console.log('render')
        // Вынесем в  отдельную переменную получение блока main
        // Элемент main, содержит верстку игрового поля
        const main = document.getElementById('main');
        // Если он уже есть на верстке, то далее испольем его
        if (main) {
            // Предварительно очистить 
            // Используем поле повторно
            this.create(main, () => {
                this.setFieldClick();
            }, gameLevel)
        // Если элемента main не существуем, создаем его
        } else {
            // Создаем поле в первый раз
            const mainBlock = document.createElement('div');
           // Устанавливаем атрибут id = main
            mainBlock.setAttribute('id', 'main');
            // Задействуем функцию 
            // Стрелочная функция create, которая отвечает за создание игрового поля
            // create принимает 3 параметра:
            // 1 - html блок в который само поле
            // 2 - callback (функция обратного вызова)
            // 3 - уровень игры
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
    /**
     * Функция для формирования игрового пооля и всех его ячеек
     * 
     * Параметры: 
     * block - блок в которые будут добавлятся поля,
     * callback - функция обратного вызова, отрабатывает в конце формирования игрового поля
     * gameLevel - уровень игры
     */
    create: function(block, callback, gameLevel){
        // Обнуляем блок с полями
        block.innerHTML = '';
        // Вводим счетчик бомб, которые будут добавлятся в игру
        let bombCounter = 0;
        // Отрисовываем главное поле
        for(let i = 0; i < 25; i++) {
            // isBomb - означаем что мы случайным образом получаем число от 0 до 1
            let isBomb = Math.floor(Math.random() * 2);
            // Создаем поле в цикле
            const field = document.createElement('div');
            // Устанавливаем класс
            field.className = 'field';
            // Устанавливаем событие клика полю (далее уходим в clickField, в этом же объекте)
            field.onclick = this.clickField
            // Выясняем, попали ли мы на бомбу (isBomb == 1)
            if(isBomb == 1) {
                // Обновляем количество бомб
                bombCounter++
                // Если уровень игры (количество возможных бомб) больше или равен bombCounter
                if(gameLevel >= bombCounter) {
                    // Устанавливаем бомбу на ячейку
                    field.dataset.bomb = isBomb
                } else {
                    // Если нет, это означает, что мы исчерпали количество возможных бом, приходящих из уровня игры
                    field.dataset.bomb = 0
                }
            // Случайное число не равно 1
            } else {
                // Строго устанавливаем признак того, что ячейка не является бомбой
                field.dataset.bomb = 0
            }
            // Добавляем поле в основой блок
            block.appendChild(field);
        }

        // Вызываем функцию обратного вызова
        callback();
    },
    /**
     * chechBomb
     * Проходится по всем полям и показывает бомбы
     * 
     * Параметры:
     * callback - отрабатывает после показа бомб
     */
    chechBomb: function(callback){
        // пройдемся по все элментам и откроем бомбы
        // Получили все элементы
        const fileds = document.querySelectorAll('.field');
        // прошлись по ним через forEach
        fileds.forEach((field) => {
            // Если у поля дата атрибут равен единице - значит это бомба
            if(field.dataset.bomb == 1) {
                // Добавляем класс bomb
                // Данный класс меняет  background-image с подарка на бомбу
                field.classList.add('bomb');
            }
        })
        // Срабатывает функция обратного вызова
        callback()
    },
    /**
     * Функция клика по полю 
     */
    clickField: function(){
        // Если мы уже проиграли, блокируем функцию
        if(MainField.isLouse) {
            // return отанавливает работу функции
            return
        }
        // Понять, кликнули на бомбу или нет
        // this - объект на который мы кликнули
        const isBomb = this.dataset.bomb == 1;

        // Если это бомба, тогда необходимо обновить таблицу рекордов
        if (isBomb) {
            
            // Получаем таблицу рекордов и записываем в нее количество набранных очков
            // ДЗ стилизовать таблицу рекордов и записать сюда имя проигравшего
            document.getElementById('record').innerHTML += `<p>${document.getElementById('points').innerText}</p>`;
            // Обнуляем количество набраных очков
            document.getElementById('points').innerText = '0'
            // Фиксируем поражение в игре, чтобы блокировать возможность дальше открывать ячейки
            MainField.isLouse = true
            // Функция chechBomb фиксирует что мы проиграли и задействует колбэк с перерывом в 500 мс
            MainField.chechBomb(
                () => {
                    setTimeout(() => {
                        // ДЗ TODO Заменить на попап
                        // alert, пока есть - останавливает выполнение кода дальше
                        alert('Вы проиграли!');
                        // Очистить поле и начать заново
                        // Обновилось игровое поле с стартовым значением
                        // Возвращаемся принудительно на 1 уровень 
                        MainField.render(MainField.startBombCount)
                    }, 500)
                }
            )
          

        } else {
            // Раскрываем ячейку с подарком, меняет  background-image на монету
            this.classList.add('coin');
            // Задействуем функцию addCoin
            MainField.addCoin();
        }
    },
    /**
     * addCoin функция обновляет блок с набранными очками
     */
    addCoin: function(){
        // получает текст из блока points
        const nowPoint = document.getElementById('points').innerText;
        // Берем текущее количество очков и пребавляет единицу
        // parseInt - необходит потому что innerText, возвращает строку
        // parseInt преобразует строку к числу (принудительно)
        const newPoint = parseInt(nowPoint) + 1;
        // Перезаписываем блок с набранными очками
        document.getElementById('points').innerText = newPoint
    }
}

/**
 * Объект Меню формирование разметки и функций, которые использует блок - меню
 * 
 * Функции:
 * - render,
 * - setEventStart,
 * - setEventChangeLevel,
 * - setEventHelp,
 */
const Menu = {
    /**
     * Функция render
     * Отвечает за формирование html лемента - блок главного меню
     * 
     * Параметры:
     * callback - функция обратного вызова, которая задействовалась с таймаутов в 500мс
     */
    render: function(callback){
        // Записываем блок меню с кнопками и элментом, для отображение очков
        // Используем - шаблонную строку
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
        // Делаем паузу в 500 мс, перед тем как задействовать функцию обратного вызова
        // для того, чтобы внутренности вызываемого колбэка видели блок меню
        setTimeout(function() {
            // Вызываем функцию обратного вызова 
            // 3 - Вызов функции обратного вызова
            // Сымысл этого вызова в том, что элементы, должны отрисовываться до установки на них события
            // Если элментов нет, но произойдет попытка установки на них событий
            // Ничего не произойлет - ошибки про событие НЕ будет
            callback();
        }, 500)
       
    }, 
    /**
     * setEventStart отвечает за установку события на кнопку - старт
     */
    setEventStart: function(){
        console.log(document.getElementById("start"))
        document.getElementById("start").onclick = function(){
            // alert('Нажали на старт игры')
            // Стартуем с первого уровня
            // Задаем уровень игры с помощью поля startBombCount, внутри объекта MainField
            // При активации метода render в объекте MainField перерисовывается игровое поле
            MainField.render(MainField.startBombCount)
        }
    },
    /**
     * setEventChangeLevel отвечает за установку событий на 3 кнопки,
     * которые управляют уровнем сложности игры
     */
    setEventChangeLevel: function(){

        // Получаем саму коллекцию кнопок (все элементы с классом changeLevel)
        const buttonsChangeLevel = document.getElementsByClassName("changeLevel")
        // Узнаем количество кнопок
        const countButton = buttonsChangeLevel.length;
        
        // Перебираем в цикле все кнопки, для того, чтобы установить событие на каждую в отдельности кнопку, установить событие клика
        for(let i = 0; i < countButton; i++) {
            // устанавливаем на каждую кнопку событие клика
            buttonsChangeLevel[i].onclick = function(){
                // Внутр и функции onclick, мы находимся в консте самого элемента
                // this - это то на что мы кликнули
                // alert('Нажали на изменение уровня')
                // Перерисовываем игровое поле
                // this.dataset.level - это цифра из дата атрибута нажимаемой кнопки
                MainField.render(this.dataset.level)
            }
        }
    },
    /**
     * Функция для подсказки, где находятся бомбы
     */
    setEventHelp: function(){
        // Установить событие клика на кнопку подсказки
        document.getElementById("help").onclick = function(){
            alert('Нажали на подсказку')

            // 1 - Необходимо найти все бомбы и сделать их видимыми
            // 2 - Через определненный промежуток времени, сделать обратное
        }
    }
}

// Запустим игру
Game.start();