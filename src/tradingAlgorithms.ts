/**
* Finds the optimal buy and sell indices for maximum profit in a price series.
* 
* Time Complexity: O(n²) in worst case due to nested loops
* 
* @param prices - Array of prices where index represents the day
* @returns Tuple of [buyIndex, sellIndex] representing the best days to buy and sell
*/
export function findBestTrade(prices: number[]): [number, number] {
    // Initialize variables to track our best trading positions
    let bestBuyIndex = 0;    // Stores the index of the best day to buy
    let bestSellIndex = 0;   // Stores the index of the best day to sell
    let currentBestProfit = 0; // Stores the best profit we've found so far
    let minPriceDrop = 0; // Stores the minimum price drop we've seen so in current iteration of outer loop

    // Flag to indicate if we've found the optimal solution
    // Starts as true and gets set to false if we find a price drop
    // that suggests there might be better opportunities ahead
    let isOptimalFound = true;
    
    // Used to mark positions where we find a price drop
    // These positions could be better buying opportunities
    let nextTradeStartIndex = -1;
    
    // Outer loop: considers each day as a potential buying day
    // We stop at length-1 since we need at least one more day to sell
    for (let currentIndex = 0; currentIndex < prices.length - 1; currentIndex++) {
        isOptimalFound = true;
        minPriceDrop = 0

        // Inner loop: looks at all future days as potential selling days
        for (let futureIndex = currentIndex + 1; futureIndex < prices.length; futureIndex++) {
            // Calculate how much profit we'd make buying at current day and selling at future day
            let potentialProfit = prices[futureIndex] - prices[currentIndex];
            
            // Calculate our current best known profit for comparison
            currentBestProfit = prices[bestSellIndex] - prices[bestBuyIndex];
            
            // If this buying and selling combination gives better profit,
            // update our best positions
            if (potentialProfit > currentBestProfit) {
                bestBuyIndex = currentIndex;
                bestSellIndex = futureIndex;
            }
            
            // If we find a price drop (negative profit), this future price
            // could be a better buying opportunity
            if (potentialProfit < minPriceDrop) {
                minPriceDrop = potentialProfit;
               
                // Store this position as a potential new starting point because:
                // 1. The price is lower here than at currentIndex
                // 2. Any future price that would profit from currentIndex would
                //    profit more if we bought at this lower price instead
                nextTradeStartIndex = futureIndex;
                
                // Signal that we've found a potentially better buying opportunity
                // and should continue searching
                isOptimalFound = false;
            }
        }
        
        // If we've completed an entire inner loop without finding any price drops
        // (isOptimalFound is still true), then we've found our optimal solution
        if (isOptimalFound) {
            return [bestBuyIndex, bestSellIndex];
        }
        else {
                // If this new potential buying point isn't too close to the end
                // of our price series (we need room to sell after buying)
            if (nextTradeStartIndex >= 1 && nextTradeStartIndex <= prices.length - 2) {
                // Adjust our current index to restart search from this new point
                // We subtract 1 because the outer loop will add 1 in its next iteration
                // this step makes our search more efficient by skipping redundant checks
                currentIndex = nextTradeStartIndex - 1;
            }
        }
    }
    
    // Return the best buying and selling days we found
    return [bestBuyIndex, bestSellIndex];
 }


/**
* Finds optimal buy/sell indices for maximum profit in O(n) time.
* Uses single pass approach by tracking minimum price seen so far.
* 
* Time Complexity: O(n) as we only pass through array once
* Space Complexity: O(1) using only fixed variables
*
* Example: For [7,1,5,3,6,4], will track 1 as minimum price 
* and buy at index 1 (price 1), sell at index 4 (price 6) for max profit of 5
*
* @param prices Daily stock prices
* @returns [buyIndex, sellIndex] for maximum profit trade
*/
export function findBestTradeFast(prices: number[]): [number, number] {
    // Handle arrays with insufficient trading days
    if (prices.length < 2) return [0, 0];
    
    // Track index of minimum price seen so far
    let minPriceIndex = 0;
    let maxProfit = 0;
    let bestBuyIndex = 0;
    let bestSellIndex = 0;
    
    // Single pass through prices
    for (let i = 1; i < prices.length; i++) {
        // If we find new minimum price, update index
        if (prices[i] < prices[minPriceIndex]) {
            minPriceIndex = i;
        } else {
            // Calculate profit if we bought at min price and sold today
            const currentProfit = prices[i] - prices[minPriceIndex];
            // Update best trade if this profit is higher
            if (currentProfit > maxProfit) {
                maxProfit = currentProfit;
                bestBuyIndex = minPriceIndex;
                bestSellIndex = i;
            }
        }
    }
    return [bestBuyIndex, bestSellIndex];
 }