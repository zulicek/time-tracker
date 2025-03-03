describe("Timer Tracker", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

    it("should start the timer when start button is clicked", () => {
      cy.get("[data-cy=main-service-selector]").click()
      cy.get("[data-cy=main-service-option]").first().click()
      cy.get("[data-cy=start-timer-button]").click()
      cy.get("[data-cy=timer-display]").should("be.visible")
      cy.get("[data-cy=stop-timer-button]").should("be.visible")
      cy.wait(2000)
      cy.get("[data-cy=timer-display]").should("not.contain", "00:00")
    })

    it("should stop the timer and save the entry", () => {
      cy.get("[data-cy=main-service-selector]").click()
      cy.get("[data-cy=main-service-option]").first().click()
      cy.get("[data-cy=start-timer-button]").click()
      cy.wait(2000)
      cy.get("[data-cy=stop-timer-button]").click()
      cy.get("[data-cy=timer-display]").should("not.exist")
    })
  })
