(() => {
    const roadWrap = document.querySelector(".road-wrap");
    const winner = document.querySelector(".winner");
    const resetBtn = document.querySelector("#reset");
    const finishLine = document
        .querySelector(".finish-line")
        .getBoundingClientRect();
    const maxSpeed = 50;
    const carWidth = 80;
    const {
        innerWidth
    } = window;
    let isFinished = false;

    const randomize = (max) => {
        return () => {
            const random = () => Math.floor(Math.random() * max);
            const generateRandom = random();
            if (generateRandom === 0) {
                return generateRandom + random();
            }
            return generateRandom;
        };
    };

    const forEachHelper = (cars) => {
        return (prop) => {
            cars.forEach((car) => {
                car[prop]();
            });
        };
    };

    const winnerIs = ({
        name,
        color
    }) => {
        winner.style.display = "block";
        winner.innerHTML = `Поебдила - ${name} тачка !`;
    };

    const raceIsFinished = (meta) => {
        isFinished = true;
        winnerIs(meta);
        document.body.style.overflow = "hidden";
        window.removeEventListener('scroll', race);
    };

    const speedRandomize = randomize(maxSpeed);
    const posRandomize = randomize(innerWidth - (carWidth + 16));

    const carFactory = ({
        car,
        carMeta,
        speed,
        pos
    }) => {
        let currentSpeed = speed;
        const carStyleTop = window.getComputedStyle(car);
        const carOffsetTop = Number(carStyleTop.top.replace("px", ""));

        const setCarPos = () => {
            car.style.top = `${carOffsetTop}px`;
            car.style.left = `${posRandomize()}px`;
        };

        const resetState = () => {
            currentSpeed = speedRandomize();
            setCarPos();
        };

        const goCar = () => {
            const {
                bottom
            } = car.getBoundingClientRect();
            if (bottom >= finishLine.top) {
                raceIsFinished(carMeta);
            }
            car.style.top = `${window.pageYOffset / currentSpeed + carOffsetTop}px`;
        };

        return {
            goCar,
            resetState,
            setCarPos,
            speed: currentSpeed
        };
    };

    const carsCollection = (carsNum) => {
        const cars = [{
                name: "Красная",
                color: "Red",
                url: "../src/car1.png"
            },
            {
                name: "Синяя",
                color: "blue",
                url: "../src/car2.png"
            },
            {
                name: "Зеленая",
                color: "green",
                url: "../src/car3.png"
            }
        ].slice(0, carsNum);

        return cars.map(({
            name,
            color,
            url
        }, i, array) => {
            const createCar = document.createElement("div");
            const createCarTxt = document.createElement("p");
            const createCarImg = document.createElement("img");

            createCar.id = name;
            createCar.className = `car car${i}`;
            createCar.style.width = `${carWidth}px`;
            createCar.style.zIndex = array.length - i;
            createCarImg.src = url;
            createCarTxt.innerHTML = name;
            createCarTxt.style.color = color;

            createCar.appendChild(createCarImg);
            createCar.appendChild(createCarTxt);
            roadWrap.appendChild(createCar);

            return carFactory({
                car: createCar,
                carMeta: {
                    name,
                    color
                },
                speed: speedRandomize(),
                post: posRandomize()
            });
        });
    };

    const cars = carsCollection();
    const registerForEachHelper = forEachHelper(cars);

    const race = () => registerForEachHelper("goCar");
    const reset = () => {
        if (window.pageYOffset > 0) {
            window.scroll({
                top: 0
            });
        }
        registerForEachHelper("resetState");
        if (isFinished) {
            isFinished = !isFinished;
            winner.style.display = "none";
            document.body.style.overflow = "visible";
            window.addEventListener("scroll", race);
        }
    };
    registerForEachHelper("setCarPos");

    resetBtn.addEventListener("click", reset);

    window.addEventListener("scroll", race);
})();