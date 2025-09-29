const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}
  
const createNote = async (page, content) => {
    await page.getByRole('button', { name: 'new note' }).click()
    await page.getByRole('textbox').fill(content)
    await page.getByRole('button', { name: 'save' }).click()


    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill('a blog created by playwright')
    await page.getByRole('textbox', { name: 'author' }).fill('playwright')
    await page.getByRole('textbox', { name: 'url' }).fill('www.playwright.com')
    await page.getByRole('button', { name: 'create' }).click()
}
  
export { loginWith, createNote }