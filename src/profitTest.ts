import { findBestTradeFast, findBestTrade } from "./tradingAlgorithms";

const testCases = [
    {
        input: [7, 1, 5, 3, 6, 4],
        expected: [1, 4],
        description: "Basic profit case - should buy at 1 and sell at 6 for profit of 5"
    },
    {
        input: [7, 6, 4, 3, 1],
        expected: [0, 0],
        description: "Decreasing prices - no profit possible, should return [0,0]"
    },
    {
        input: [1, 2, 3, 4, 5],
        expected: [0, 4], 
        description: "Increasing prices - should buy first day, sell last day"
    },
    {
        input: [3, 3, 3],
        expected: [0, 0],
        description: "Flat prices - no profit possible, should return [0,0]"
    },
    {
        input: [20,18,15,8,3,6,10,4,12],
        expected: [4,8],
        description: "Large drops then recovery - should buy at 3 and sell at 12 for profit of 9"
    },
    {
        input: [],
        expected: [0,0],
        description: "Edge case: Empty array - should safely return [0,0]"
    },
    {
        input: [5],
        expected: [0,0],
        description: "Edge case: Single price - no trades possible, should return [0,0]"
    },
    {
        input: [1,12,1,12],
        expected: [0,1],
        description: "Multiple peaks - should capture first peak for fastest profit"
    }
 ];
 
 console.log("Running test cases for both implementations...\n");
 
 testCases.forEach(({input, expected, description}) => {
    const result1 = findBestTrade(input);
    const result2 = findBestTradeFast(input);
    
    const passed1 = result1[0] === expected[0] && result1[1] === expected[1];
    const passed2 = result2[0] === expected[0] && result2[1] === expected[1];
    
    console.log(`Test: ${description}`);
    console.log(`Input array: [${input}]`);
    console.log(`Expected: Buy at index ${expected[0]} (price: ${input[expected[0]] ?? 'N/A'}), ` + 
                `Sell at index ${expected[1]} (price: ${input[expected[1]] ?? 'N/A'})`);
    
    if (!passed1 || !passed2) {
        if (!passed1) {
            console.log(`❌ Original implementation FAILED`);
            console.log(`   Got: Buy at index ${result1[0]} (price: ${input[result1[0]] ?? 'N/A'}), ` +
                       `Sell at index ${result1[1]} (price: ${input[result1[1]] ?? 'N/A'})`);
        }
        if (!passed2) {
            console.log(`❌ Efficient implementation FAILED`);
            console.log(`   Got: Buy at index ${result2[0]} (price: ${input[result2[0]] ?? 'N/A'}), ` +
                       `Sell at index ${result2[1]} (price: ${input[result2[1]] ?? 'N/A'})`);
        }
    } else {
        console.log(`✅ Both implementations PASSED`);
        if (input.length > 0) {
            const profit = input[expected[1]] - input[expected[0]];
            console.log(`   Profit: ${profit}`);
        }
    }
    console.log("----------------------------------------\n");
 });

 // Add to profitTest.ts

function benchmarkTest() {
    // Generate large array
    const prices = Array.from({length: 10000}, () => 
        Math.floor(Math.random() * 1000));
    
    console.log("\nBenchmarking with 10,000 prices:");
    
    const start1 = performance.now();
    const result1 = findBestTrade(prices);
    const time1 = performance.now() - start1;
    
    const start2 = performance.now();
    const result2 = findBestTradeFast(prices);
    const time2 = performance.now() - start2;
    
    console.log(`O(n²): ${time1.toFixed(2)}ms`);
    console.log(`O(n): ${time2.toFixed(2)}ms`);
}