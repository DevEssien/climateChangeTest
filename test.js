const b = { c: 9, f:7}
const data = { c: 2, d: 4, e: 3, f: 5}
let d;
for (const key in data) {
     d = { ...data, [key]: b[key]}
}
console.log(d)