
const { test, describe, expect, beforeEach } = require('@playwright/test')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
        data: {
        name: 'root',
        username: 'Superuser',
        password: 'salainen'
        }
    })
    await page.goto('http://localhost:5173')
  })



  test('Login form is shown', async ({ page }) => {

    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    // await expect(page.getByText('log in')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByLabel('username').fill('root')
    await page.getByLabel('password').fill('salainen')

    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Superuser logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByLabel('username').fill('root')
    await page.getByLabel('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong username or password')).toBeVisible()
    await expect(page.getByText('Superuser logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByLabel('username').fill('root')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox', { name: 'title' }).fill('4')
      await page.getByRole('textbox', { name: 'author' }).fill('playwright')
      await page.getByRole('textbox', { name: 'url' }).fill('www.playwright.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('a new blog 4 by playwright added')).toBeVisible()
    })

    test('user can like a blog', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox', { name: 'title' }).fill('3')
      await page.getByRole('textbox', { name: 'author' }).fill('playwright')
      await page.getByRole('textbox', { name: 'url' }).fill('www.playwright.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText('3 playwright').locator('..').getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by creator', async ({ page }) => {
        await page.getByText('4 playwright').locator('..').getByRole('button', { name: 'view' }).click()
        page.once('dialog', dialog => dialog.accept())

        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('4 playwright')).not.toBeVisible()
      })
  })

  test('only the creator sees the delete button', async ({ page, request }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByLabel('username').fill('root')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await request.post('http://localhost:3003/api/users', {
      data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
    })
  

    await page.getByRole('button', { name: 'logout' }).click()
    await page.getByRole('button', { name: 'log in' }).click()
  

    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await page.getByText('4 playwright').getByRole('button', { name: 'view' }).click()
  
    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
  })
  




})
