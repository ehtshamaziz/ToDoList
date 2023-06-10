const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function runTests() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // =============Test Case 1: Verify Title and Heading====================
    await driver.get("http://localhost:3000");
    let title = await driver.getTitle();
    let heading = await driver.findElement(By.id("heading")).getText();
    assert.strictEqual(title, "To Do List");
    console.log("Test case 1 passed");
  } catch {
    console.log("Test case 1 failed");
  }
  // ==============Test Case 2(Checking input field by entering value)======================
  try {
    const form = await driver.findElement(By.css("form.item"));

    // Locating the input element within the form
    const input = await form.findElement(By.css('input[name="toDoItem"]'));

    // Locating the button element within the form
    const button = await form.findElement(By.css('button[type="submit"]'));

    // Entering a value into the input field
    const inputValue = "New Test Item";
    await input.sendKeys(inputValue);

    // Submitting the form by clicking the button
    await button.click();
    console.log("Test case 2 passed");
  } catch {
    console.log("Test case 2 failed");
  }
  // =================Test Case 3(Matching entered value)=======================
  try {
    const box = await driver.findElement(By.css(".box"));

    // Locating all the item elements within the box
    const items = await box.findElements(By.css(".item"));

    // Iterating over each item element
    for (let item of items) {
      const paragraph = await item.findElement(By.css("p"));
      assert.strictEqual(paragraph, inputValue);
    }
    console.log("Test case 3 passed");
  } catch {
    console.log("Test case 3 failed");
  } finally {
    await driver.quit();
  }
}

runTests();
