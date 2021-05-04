# HIVCohortFilter: Result Verification Tests

This folder contains tests that review cohort JSON files outputted by the HIVCohortFilter app and
verify that all subjects contained in the file match the criteria for the given case. These tests were written
to ensure that the output data contains no false positives. 

### Prerequisites

- [node](https://nodejs.org/en/download/)

### Running the tests
First, use the application to download a cohort JSON file from one of the cases.
Then, run the below in this folder:
```
node <test-file.js> ./<json-result-file>
```
Any subjects that do not meet the criteria will be printed to the console.