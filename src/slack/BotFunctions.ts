import { getDonuts } from "../donuts/firebaseDonutFunctions";

const donuts = await getDonuts();
const donut = donuts[0]

const groups = donut.groups;

console.log(donuts)
console.log(donut)
console.log(groups)