# Stock Trading Profit Calculator

This application helps users find the optimal buy and sell days to maximize their trading profit. It implements two different algorithmic approaches - an O(n²) optimized method and an O(n) efficient method - and allows users to compare their performance.

## Setup

To get started, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/stock-trading-profit.git
cd stock-trading-profit
```

2. Install the dependencies:

```bash
npm install
```

## Project Structure

The project has the following structure:

```
stock-trading-profit/
├── src/
│   ├── main.ts         # Interactive CLI
│   ├── tradingAlgorithms.ts # Implementations of the trading algorithms
│   └── profitTest.ts   # Test cases for the trading algorithms
├── package.json
└── tsconfig.json
```

- `main.ts` contains the interactive command-line interface (CLI) for the application.
- `tradingAlgorithms.ts` houses the implementations of the O(n²) and O(n) trading algorithms.
- `profitTest.ts` includes the test cases for the trading algorithms.

## Configuration Files

The project uses the following configuration files:

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"]
}
```

This TypeScript configuration file specifies the target JavaScript version, the module system, the output directory, strict type checking, and module interoperability.

### `package.json`

```json
{
  "dependencies": {
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2"
  }
}
```

The `package.json` file lists the dependencies for the project, which include the `ts-node` and `typescript` packages.

## Running the Application

### Interactive Mode

To launch the interactive command-line interface, run the following command:

```bash
npx ts-node src/main.ts
```

This will start the CLI, where you can:

1. Enter an array of stock prices.
2. Choose to run the O(n²) optimized method, the O(n) efficient method, or both for comparison.
3. View the results, including the buy and sell days, the profit, and the execution time.

### Running Tests

To execute the test cases, run the following command:

```bash
npx ts-node src/profitTest.ts
```

This will run the predefined test cases and display the results, indicating whether each test case passed or failed.

## Implementations

The project implements two different approaches to finding the optimal buy and sell days for maximum trading profit:

1. **O(n²) Optimized Method**:

   - Handles early exits and skips redundant checks on price drops.
   - Better suited for small arrays.

2. **O(n) Efficient Method**:
   - Performs a single pass through the array.
   - Constant memory usage.
   - Optimal for large datasets.

Both implementations are available in the `tradingAlgorithms.ts` file, and you can choose to use either one (or run both for comparison) in the interactive CLI.

## Example Usage

Here's an example of how to use the trading algorithms in your code:

```typescript
import { findBestTrade, findBestTradeFast } from "./tradingAlgorithms";

const prices = [7, 1, 5, 3, 6, 4];

// O(n²) implementation
const [buyIndex, sellIndex] = findBestTrade(prices);
// Returns [1, 4] - Buy at 1, sell at 6

// O(n) implementation
const [buy, sell] = findBestTradeFast(prices);
// Returns [1, 4] - Buy at 1, sell at 6
```

## Interactive Mode Sample

Here's an example of the interactive CLI in action:

```
Enter array size: 6
Enter price 1: 7
Enter price 2: 1
Enter price 3: 5
Enter price 4: 3
Enter price 5: 6
Enter price 6: 4

Choose option:
1. Enter prices manually
2. Run performance benchmark
3. Exit
Enter choice (1-3): 1

Input array: [7, 1, 5, 3, 6, 4]

Running O(n²) method:
Buy at price 1 (index 1)
Sell at price 6 (index 4)
Profit: 5
Execution time: 0.0543ms

Would you like to run the O(n) efficient method for comparison? (y/n): y

Running O(n) method:
Buy at price 1 (index 1)
Sell at price 6 (index 4)
Profit: 5
Execution time: 0.0127ms

The O(n) method is 4.3x faster

Would you like to continue? (y/n): n
```

In this example, the user enters an array of stock prices, then chooses to run both the O(n²) and O(n) methods for comparison. The results, including the buy and sell days, the profit, and the execution times, are displayed. Finally, the user is asked if they'd like to continue or exit the application.

## Test Cases

The project includes a set of test cases to verify the correctness of the trading algorithms. These test cases cover various scenarios, including:

- Basic profit scenarios
- Edge cases (empty/single element arrays)
- Monotonic series (increasing or decreasing prices)
- Multiple peaks and valleys in the price series
- Large price variations

You can run the test cases by executing the `src/profitTest.ts` file using the `npx ts-node` command.

Feel free to explore the code, run the tests, and try out the interactive CLI. If you have any questions or need further assistance, please don't hesitate to ask.
