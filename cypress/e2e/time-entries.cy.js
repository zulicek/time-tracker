describe("Time Entries", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("should display time entries list", () => {
    cy.get("[data-cy=time-entries-list]").should("be.visible");
    cy.get("[data-cy=time-entry-item]").should("have.length.at.least", 1);
  });

  it("should open add entry modal when add button is clicked", () => {
    cy.get("[data-cy=add-entry-button]").click();
    cy.get("[data-cy=time-entry-modal]").should("be.visible");
    cy.get(".ant-modal-title").should("contain", "Add Time Entry");
  });

  it("should add a new time entry", () => {
    cy.get("[data-cy=add-entry-button]").click();
    cy.get("[data-cy=service-selector]").click();
    cy.get("[data-cy=service-selector]").get(".ant-select-item-option").first().click();
    cy.get("[data-cy=time-input]").clear().type("150");
    cy.get("[data-cy=note-input]").type("Test description");
    cy.get(".ant-modal-footer .ant-btn-primary").click();
    cy.get("[data-cy=time-entry-item]").should("contain", "Test description");
  });

  it("should edit an existing time entry", () => {
    cy.get("[data-cy=edit-entry-button]").first().click();
    cy.get("[data-cy=time-entry-modal]").should("be.visible");
    cy.get(".ant-modal-title").should("be.visible");
    cy.get("[data-cy=note-input]").clear().type("Updated description");
    cy.get(".ant-modal-footer .ant-btn-primary").click();
    cy.get("[data-cy=time-entry-item]").should(
      "contain",
      "Updated description"
    );
  });

  it("should delete a time entry after confirmation", () => {
    cy.get("[data-cy=time-entry-item]").first().invoke("text").then((entryText) => {
      cy.get("[data-cy=delete-entry-button]").first().click();
      cy.get("[data-cy=confirmation-modal]").should("be.visible");
      cy.get(".ant-modal-footer .ant-btn-primary").click();
      cy.get("[data-cy=time-entry-item]").should("not.contain", entryText);
    });
  });
});
