@mod @mod_smarturl @javascript
Feature: View a Smart URL document
  In order to inspect a document and its description
  As a course participant
  I can view both from the resource page

  Scenario: An embedded document keeps its description below the media
    Given the following "courses" exist:
      | fullname        | shortname |
      | Resource course | RESOURCE  |
    And the following "activities" exist:
      | activity | course   | idnumber  | name               | intro                    | externalurl                         | display_mode |
      | smarturl | RESOURCE | reference | Reference document | Document description.    | https://example.org/reference.pdf    | EMBED        |
    When I am on the "Reference document" "smarturl activity" page logged in as "admin"
    Then I should see "Document description."
    And ".smu-player iframe" "css_element" should exist
    And ".smu-description" "css_element" should exist
