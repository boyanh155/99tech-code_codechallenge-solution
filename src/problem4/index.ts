// implicit vs explicit
const sum_to_n_a = (n: number): number => {
    let sum: number = 0;
    let index: number = 0;
    // Function iterate each integer in a sequence integer array from 0 to n. 
    // Time complex: O(n) - n should be n input in this case
    do {
        index++;
        console.log(index)
        sum += index;
    } while (index < n)
    return sum;
}
// Gauss sum form
// Time complex: O(n)
const sum_to_n_b = (n: number): number => (n * (n + 1)) / 2

// Reduce, it the same with loop :((
const sum_to_n_c = (n: number): number => Array.from({ length: n + 1 }, (_, i) => i).reduce((prev, cur) => prev + cur, 0)