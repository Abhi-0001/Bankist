'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// // Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-06-27T17:01:17.194Z',
    '2023-06-24T23:36:17.929Z',
    '2023-06-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.label__date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.time');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.operation__btn--transfer');
const btnLoan = document.querySelector('.operation__btn--loan');
const btnClose = document.querySelector('.operation__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.transfer__input--to');
const inputTransferAmount = document.querySelector('.transfer__input--amount');
const inputLoanAmount = document.querySelector('.operation__input--loan');
const inputCloseUsername = document.querySelector('.operation__input--user');
const inputClosePin = document.querySelector('.operation__input--pin');
const movementDate = document.querySelector('.movement__date');

const createUserName = function (accs) {
  accs.forEach(function (acc, i) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(subName => subName[0])
      .join('');
  });
};

const calcDisplayDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = `${date.getFullYear()}`.padStart(2, 0);
  return `${day}/${month}/${year}`;
};

// NUMBER Formating
const formatCur = function (value, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(value);
};

// ADD movements function
const addMovements = function (acct, sort = false) {
  const movs = sort
    ? acct.movements.slice().sort((a, b) => a - b)
    : acct.movements;
  containerMovements.innerHTML = '';

  movs.forEach(function (value, i, _) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acct.movementsDates[i]);
    const displayDate = calcDisplayDate(date);
    const html = `
    <div class="movement__row">
    <div class="movement__op"> 
      <p class="movement__text movement__text-${type}">${i + 1} ${type}</p>
      <p class="movement__date">${displayDate}</p>
    </div>
    <p class="movement__row--value">${formatCur(
      value,
      acct.locale,
      acct.currency
    )}</p>
    </div> `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display balance function
const calcDisplayBalance = function (acct) {
  acct.balance = acct.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acct.balance,
    acct.locale,
    acct.currency
  )}`;
};

const calcDisplaySummary = function (acct) {
  const income = acct.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${formatCur(income, acct.locale, acct.currency)}`;

  const withdrawal = Math.abs(
    acct.movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0)
  );
  labelSumOut.textContent = `${formatCur(
    withdrawal,
    acct.locale,
    acct.currency
  )}`;

  const interest = acct.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acct.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCur(
    interest,
    acct.locale,
    acct.currency
  )}`;
};
createUserName(accounts);

const updateUI = function () {
  addMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

// LOGIN system work
let currentAccount, timer;

// // FAKE LOGIN
// currentAccount = account2;
// containerApp.style.opacity = 100;
// updateUI();

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // welcome text
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // DATE
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hours = `${date.getHours()}`.padStart(2, 0);
    // const min = `${date.getMinutes()}`.padStart(2, 0);
    const date = new Date();
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      // weekday: 'narrow',
      // weekday: 'short',
      // weekday: 'long',
    };
    // const locale = navigator.language;
    // const locale = navigator.locale;
    labelDate.textContent = `As of ${new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(date)}`;
    // UPDATE WHOLE UI
    updateUI();
    // display app
    containerApp.style.opacity = 100;
    // normalising input fileds
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // timer
    clearInterval(timer);
    let time = 600;
    let min = Math.trunc(time / 60);
    let sec = time % 60;
    timer = setInterval(function () {
      labelTimer.textContent = `${String(min).padStart(2, 0)}:${String(sec).padStart(2, 0)}`;
      sec--;
      if (sec < 0) {
        min--;
        sec = 59;
      }
      if (min < 0) {
        clearInterval(this);
        containerApp.style.opacity = 0;
      }
    }, 1000);
  }

  // Working Transfers
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const recieverAccount = accounts.find(
      acc => acc.userName === inputTransferTo.value
    );

    if (
      currentAccount.balance > amount &&
      recieverAccount?.userName !== currentAccount.userName
    ) {
      recieverAccount.movements.push(amount);
      currentAccount.movements.push(-amount);
      // DATE
      currentAccount.movementsDates.push(new Date());
      recieverAccount.movementsDates.push(new Date());

      // clear fields
      inputTransferAmount.value = inputTransferTo.value = '';
      inputTransferTo.blur();

      //updating WHOLE UI
      updateUI();
    }
  });
  // Loan Operation implementation

  btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = +inputLoanAmount.value;
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1))
      setTimeout(function () {
        // Loan sanctioned
        currentAccount.movements.push(Math.floor(amount));
        currentAccount.movementsDates.push(new Date());
        //update UI
        updateUI();
      }, 2500);
    //clear field
    inputLoanAmount.value = '';
  });

  // Close Operation implementation
  btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    const userToDel = inputCloseUsername.value;
    if (
      currentAccount.userName === userToDel &&
      +inputClosePin.value === currentAccount.pin
    ) {
      const acct = accounts.findIndex(acc => acc.userName === userToDel);
      // DELETING THE ACCOUNT
      accounts.splice(acct, 1);
      console.log(accounts);

      //clearing fields
      inputCloseUsername.value = inputClosePin.value = '';
      //Hiding the UI
      containerApp.style.opacity = 0;
    }
  });

  //Sort button working
  let sorted = false;
  btnSort.addEventListener('click', function () {
    addMovements(currentAccount, !sorted);
    sorted = !sorted;
  });
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // forEach on Arrays
// movements.forEach(function(value, index, arr){
//   console.log(`At ${index+1} position ${value} is present.`)
// })
// // forEach on Maps
// currencies.forEach(function(value, key, map){
//   console.log(`${key}: ${value}`);
// })
/////////////////////////////////////////////////

//CHALLENGE 1:

// const checkDogs = function(dogsJulia, dogsKate){
//   let juliaCopy = dogsJulia;
//   juliaCopy = juliaCopy.slice(1, juliaCopy.length-2);
//   const jk = juliaCopy.concat(dogsKate);
//   console.log(jk);
//   jk.forEach(function(val, i){
//     const str = `Dog number ${i+1}`;
//     val >=3 ? console.log(`${str} is an adult, and is ${val} years old`) : console.log(`${str} is still a puppy🐶`);
//   })
// }

// console.log('-----data 1------');
// let jDog =  [3, 5, 2, 12, 7];
// let kDog = [4,1, 15, 8, 3];
// checkDogs(jDog, kDog);
// console.log('-----data 2------');
// jDog = [9, 16, 6, 8, 3];
// kDog = [10, 5, 6, 1, 4];
// checkDogs(jDog, kDog);

//CHALLENGE 2.

// const calcAverageHuman = function(ages){
//   const humanAge = ages.map(age => age<=2 ? 2 * age : 16 + 4*age);
//   const adultsAge = humanAge.filter(age => age>=18);
//   const average = adultsAge.reduce((acc, age) => (acc+age),0)/adultsAge.length;
//   console.log(average);
// }
// calcAverageHuman([5,2,4,1,15, 8, 3]);
// calcAverageHuman([16, 6, 10, 5, 6, 1, 4]);

// const calcAverageHuman = function(ages){
//   const average = ages.map(age => age<=2 ? age*2 : age*4 + 16)
//   .filter(humanAge => humanAge >= 18)
//   .reduce((acc, adultAge,i, arr) => acc + (adultAge/arr.length), 0);
//   return average;
// }

// console.log(calcAverageHuman([5,2,4,1,15, 8, 3]));
// console.log(calcAverageHuman([16, 6, 10, 5, 6, 1, 4]));

// CHALLENGE 4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 250, owners: ['Matilda'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
];

const checkEating = function (dog) {
  if (dog.curFood > dog.recommendedFood * 1.1) return 'too Much';
  else if (dog.curFood < dog.recommendedFood * 0.9) return 'too little';
  else return 'correct';
};

// 1.
dogs.forEach(function (dog) {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
});

// 2.
// dogs.find(function(dog){
//   if(dog.owners.includes('Sarah'))
//     console.log(`Your dog is eating ${checkEating(dog)} amount`);
// });

// 3.

// let ownersEatTooMuch1 = [];
// for(const dog of dogs){
//   if(checkEating(dog) === 'too Much')
//     ownersEatTooMuch1.push(...dog.owners.flat());
// }

// const ownersEatTooMuch = dogs.filter(dog => checkEating(dog) === 'too Much').map(tooMuchDog => tooMuchDog.owners).flat();

// const ownersEatTooLittle = dogs.filter(dog => checkEating(dog) === 'too little').map(tooMuchDog => tooMuchDog.owners).flat();

// // 4.

// let tooMuch = ``;
// ownersEatTooMuch.forEach(function(owner, ind, arr){
//   if(ind != arr.length - 1)
//     tooMuch = tooMuch.concat(` ${owner} and`);
//   else
//     tooMuch = tooMuch.concat(` ${owner}'s dogs eat too much!`);
// })
// let tooLittle = ``;
// ownersEatTooLittle.forEach(function(owner, ind, arr){
//   if(ind != arr.length - 1)
//     tooLittle = tooLittle.concat(` ${owner} and`);
//   else
//     tooLittle = tooLittle.concat(` ${owner}'s dogs eat too little!`);
// })
// console.log(tooMuch);
// console.log(tooLittle);

// 5. exact eating dog
// dogs.forEach(dog => {
//   if(dog.curFood === dog.recommendedFood){
//     console.log(true)
//   }
//   else console.log(false);
// });

// 6 & 7.
// let okayDog = [];
// dogs.forEach(dog => {
//   if(checkEating(dog) === 'correct'){
//     okayDog.push(dog);
//     console.log(true)
//   }
//   else console.log(false);
// });
// console.log(...okayDog);

// 8.

// const sortedDogs = dogs.slice().sort((dog1, dog2) => dog1.recommendedFood - dog2.recommendedFood);
// console.log(...sortedDogs);

// setInterval(function () {
//   console.log(new Date());
// }, 3000);
