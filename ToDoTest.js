const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function runTests() {
  // Create a new instance of the WebDriver
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open the application in the browser
    await driver.get("http://localhost:3000");

    // Wait until the page is loaded and the list title is displayed
    await driver.wait(until.elementLocated(By.className("list-title")), 5000);

    // Verify the initial list title
    const listTitleElement = await driver.findElement(
      By.className("list-title")
    );
    const listTitleText = await listTitleElement.getText();
    assert.strictEqual(
      listTitleText,
      "Today",
      "List title does not match the expected value."
    );

    // Enter a new item and submit the form
    const newItemInput = await driver.findElement(By.id("new-item-input"));
    await newItemInput.sendKeys("New item", Key.ENTER);

    // Wait until the new item is added to the list
    await driver.wait(
      until.elementLocated(By.xpath("//li[text()='New item']")),
      5000
    );

    // Verify the new item is added to the list
    const newItemElement = await driver.findElement(
      By.xpath("//li[text()='New item']")
    );
    assert.ok(newItemElement, "New item is not found in the list.");

    // Delete the new item
    const deleteButton = await driver.findElement(
      By.xpath("//button[contains(text(),'Press this to delete an item')]")
    );
    await deleteButton.click();

    // Wait until the new item is deleted from the list
    await driver.wait(until.stalenessOf(newItemElement), 5000);

    // Verify the new item is deleted from the list
    const deletedItemElement = await driver.findElement(
      By.xpath("//li[text()='New item']")
    );
    assert.ok(
      !deletedItemElement,
      "New item is still found in the list after deletion."
    );

    console.log("Test case passed.");
  } catch (error) {
    console.error("Test case failed.", error);
  } finally {
    // Quit the WebDriver
    await driver.quit();
  }
}

runTests();
