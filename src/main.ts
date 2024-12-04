import * as fs from 'fs';
import * as path from 'path';
import { findBestTrade, findBestTradeFast } from './tradingAlgorithms';
import * as readline from 'readline';

// This is the readline interface, which allows us to interact with the user through the terminal.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * This function prompts the user to answer a yes/no question and returns the boolean result.
 * @param question - The question to ask the user.
 * @returns A Promise that resolves to a boolean indicating the user's response.
 */
async function promptYesNo(question: string): Promise<boolean> {
  const answer = await new Promise<string>((resolve) => {
    rl.question(`${question} (y/n): `, resolve);
  });
  return answer.toLowerCase().startsWith('y');
}

/**
 * This function prompts the user to enter an array of stock prices and returns the array.
 * @returns A Promise that resolves to an array of numbers representing the stock prices.
 */
async function promptUser(): Promise<number[]> {
  // First, we prompt the user to enter the size of the price array.
  const size = await new Promise<number>((resolve) => {
    rl.question('Enter array size: ', (answer) => {
      resolve(parseInt(answer));
    });
  });

  const prices: number[] = [];
  // Then, we prompt the user to enter the prices one by one and add them to the prices array.
  for (let i = 0; i < size; i++) {
    const price = await new Promise<number>((resolve) => {
      rl.question(`Enter price ${i + 1}: `, (answer) => {
        resolve(parseFloat(answer));
      });
    });
    prices.push(price);
  }
  return prices;
}

/**
 * This function prompts the user to enter the size for the large dataset test and returns the size.
 * @returns A Promise that resolves to the size of the large dataset, with a minimum of 1000.
 */
async function promptLargeDatasetSize(): Promise<number> {
  return new Promise((resolve) => {
    rl.question('Enter size for large dataset test (minimum 1000): ', (answer) => {
      const size = parseInt(answer);
      resolve(size < 1000 ? 1000 : size);
    });
  });
}

/**
 * This function runs the provided function and measures the execution time.
 * @param prices - The array of stock prices to pass to the function.
 * @param fn - The function to be benchmarked.
 * @returns An array containing the result of the function and the execution time.
 */
function runBenchmark(prices: number[], fn: (p: number[]) => [number, number]): [[number, number], number] {
  // We start the performance timer before calling the provided function.
  const start = performance.now();
  const result = fn(prices);
  const time = performance.now() - start;
  return [result, time];
}

/**
 * This function runs the performance benchmark for the stock trading algorithms.
 * It generates a large dataset of random prices, saves it to a file, and then runs the benchmarks.
 */
async function runPerformanceBenchmark() {
  // First, we prompt the user to enter the size for the large dataset.
  const size = await promptLargeDatasetSize();

  // Next, we generate the large dataset of random prices.
  const largeArray = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));

  // We then save the entire dataset to a text file in the root directory of the project.
  const filePath = path.join(__dirname, 'large_dataset.txt');
  await fs.promises.writeFile(filePath, largeArray.join(','));

  // We log the size of the generated dataset and display the first and last 20 elements.
  console.log(`\nGenerated dataset of ${size} elements`);
  console.log('First 20:', largeArray.slice(0, 20));
  console.log('Last 20:', largeArray.slice(-20));

  // We inform the user that the file has been generated and saved to the root directory.
  console.log(`\nThe large dataset has been saved to '${filePath}'`);

  // Next, we run the benchmarks for the O(n²) and O(n) trading algorithms.
  const [result1, time1] = runBenchmark(largeArray, findBestTrade);
  const [result2, time2] = runBenchmark(largeArray, findBestTradeFast);

  // Finally, we print the results of the benchmarks to the console.
  console.log('\nBenchmark results:');
  console.log(`O(n²): Buy at price ${largeArray[result1[0]]} (index ${result1[0]}), Sell at price ${largeArray[result1[1]]} (index ${result1[1]}), Profit: ${largeArray[result1[1]] - largeArray[result1[0]]}, Time: ${time1.toFixed(2)}ms`);
  console.log(`O(n):  Buy at price ${largeArray[result2[0]]} (index ${result2[0]}), Sell at price ${largeArray[result2[1]]} (index ${result2[1]}), Profit: ${largeArray[result2[1]] - largeArray[result2[0]]}, Time: ${time2.toFixed(2)}ms`);
  console.log(`\nThe O(n) method is ${(time1 / time2).toFixed(1)}x faster`);
}

/**
 * This is the main entry point of the program, where the user interactions and the overall flow of the application are handled.
 */
async function main() {
  // We start a loop that will continue until the user chooses to exit the program.
  while (true) {
    // We display the main menu options for the user to choose from.
    console.log('\nChoose option:');
    console.log('1. Enter prices manually');
    console.log('2. Run performance benchmark');
    console.log('3. Exit');

    // We prompt the user to enter their choice and store it in the `choice` variable.
    const choice = await new Promise<string>((resolve) => {
      rl.question('Enter choice (1-3): ', resolve);
    });

    // We check the user's choice and execute the corresponding functionality.
    if (choice === '3') {
      // If the user chooses option 3, we exit the program.
      break;
    } else if (choice === '1') {
      // If the user chooses option 1, we prompt them to enter stock prices manually and then call the `handlePriceAnalysis` function.
      const prices = await promptUser();
      await handlePriceAnalysis(prices);
    } else if (choice === '2') {
      // If the user chooses option 2, we call the `runPerformanceBenchmark` function to run the benchmark.
      await runPerformanceBenchmark();
    } else {
      // If the user enters an invalid choice, we log an error message.
      console.log('Invalid option. Please try again.');
    }

    // After executing the chosen functionality, we ask the user if they want to continue.
    if (!await promptYesNo('\nWould you like to continue?')) {
      // If the user chooses not to continue, we break out of the main loop and exit the program.
      break;
    }
  }

  // Once the main loop is exited, we close the readline interface.
  rl.close();
}

/**
 * This function takes an array of stock prices, analyzes them to find the best buy and sell days,
 * and then prints the results to the console.
 * 
 * @param prices - An array of stock prices, where each element represents the price on a given day.
 */
async function handlePriceAnalysis(prices: number[]) {
    console.log('\nInput array:', prices);
  
    // First, we run the benchmark using the O(n²) findBestTrade function.
    const [result1, time1] = runBenchmark(prices, findBestTrade);
    console.log('\nRunning O(n²) method:');
    printResults(prices, result1, time1);
  
    // We then ask the user if they'd like to compare the results to the O(n) efficient method.
    if (await promptYesNo('\nWould you like to run the O(n) efficient method for comparison?')) {
      // If the user agrees, we run the benchmark using the O(n) findBestTradeFast function.
      const [result2, time2] = runBenchmark(prices, findBestTradeFast);
      console.log('\nRunning O(n) method:');
      printResults(prices, result2, time2);
  
      // Finally, we ask the user if they'd like to run a benchmark with a larger dataset.
      if (await promptYesNo('\nWould you like to run a benchmark with a larger dataset?')) {
        await runPerformanceBenchmark();
      }
    }
  }
  
  /**
   * This function prints the results of the stock trading analysis, including the buy and sell days,
   * the profit, and the execution time.
   * 
   * @param prices - The original array of stock prices.
   * @param result - The [buyDay, sellDay] tuple returned by the trading algorithm.
   * @param time - The execution time of the trading algorithm in milliseconds.
   */
  function printResults(prices: number[], result: [number, number], time: number) {
    console.log(`Buy at price ${prices[result[0]]} (index ${result[0]})`);
    console.log(`Sell at price ${prices[result[1]]} (index ${result[1]})`);
    console.log(`Profit: ${prices[result[1]] - prices[result[0]]}`);
    console.log(`Execution time: ${time.toFixed(4)}ms`);
  }

// We call the main function to start the program.
main().catch(console.error);