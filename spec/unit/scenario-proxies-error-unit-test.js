"use strict";

const Maddox = require("../../lib/index"), // require("maddox");
  HttpReqController = require("../testable/modules/test-module/from-http-req-controller"),
  FromCallbackController = require("../testable/modules/test-module/from-callback-controller"),
  FromPromiseController = require("../testable/modules/test-module/from-promise-controller"),
  FromSynchronousController = require("../testable/modules/test-module/from-synchronous-controller"),
  SpecialScenariosController = require("../testable/modules/test-module/special-scenarios-controller"),
  StatelessEs6Proxy = require("../testable/proxies/stateless-es6-proxy"),
  random = require("../random");

const Scenario = Maddox.functional.HttpReqScenario,
  FromPromiseScenario = Maddox.functional.FromPromiseScenario,
  FromCallbackScenario = Maddox.functional.FromCallbackScenario,
  FromSynchronousScenario = Maddox.functional.FromSynchronousScenario;

describe("When using a Scenario and getting errors", function () {
  let testContext;

  beforeEach(function () {
    testContext = {};

    testContext.setupTest = function () {
      testContext.entryPointObject = HttpReqController;
      testContext.entryPointFunction = "statelessEs6Proxy";
    };

    testContext.setupHttpRequest = function () {
      testContext.httpRequest = {
        params: {
          personId: random.uniqueId()
        },
        query: {
          homeState: random.word(2)
        }
      };

      testContext.httpRequestParams = [testContext.httpRequest];
    };

    testContext.setupGetFirstName = function () {
      testContext.getFirstName1Params = [testContext.httpRequest.params.personId];
      testContext.getFirstName1Result = random.firstName();

      testContext.getFirstName2Params = [testContext.httpRequest.params.personId, testContext.getFirstName1Result];
      testContext.getFirstName2Result = random.firstName();
    };

    testContext.setupGetMiddleName = function () {
      testContext.getMiddleNameParams = [testContext.httpRequest.params.personId, testContext.getFirstName2Result];
      testContext.getMiddleNameResult = random.firstName();
    };

    testContext.setupGetLastName = function () {
      testContext.getLastNameParams = [testContext.httpRequest.params.personId, testContext.getFirstName2Result, testContext.getMiddleNameResult];
      testContext.getLastNameResult = [undefined, random.lastName()];
    };

    testContext.setupExpected = function () {
      testContext.expectedResponse = [{
        personId: testContext.httpRequest.params.personId,
        homeState: testContext.httpRequest.query.homeState,
        lastName: testContext.getLastNameResult[1]
      }];

      testContext.expectedStatusCode = [200];
    };
  });

  // 4003, 4004

  // InputParamsArray 1000
  it("it should throw when withInputParams is given a parameter that is not of type Array.", function () {
    testContext.setupInputParams = function () {
      testContext.inputParams = "Some type that is not of type Array.";
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1000): When calling 'withInputParams', the parameter must be of type Array.";
    };

    testContext.setupInputParams();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .withInputParams(testContext.inputParamsArray);

    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }

  });

  // HttpRequestArray 1001
  it("it should throw when withHttpRequest is given a parameter that is not of type Array.", function () {
    testContext.setupInputParams = function () {
      testContext.inputParams = "Some type that is not of type Array.";
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1001): When calling 'withHttpRequest', the parameter must be of type Array.";
    };

    testContext.setupInputParams();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .withHttpRequest(testContext.httpRequestParams);

    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }

  });

  // MockThisFunctionMockString 1002
  it("it should throw when the first parameter in mockThisFunction is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1002): When calling 'mockThisFunction', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction({}, "getFirstName", StatelessEs6Proxy);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MockThisFunctionString 1003
  it("it should throw when the second parameter in mockThisFunction is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1003): When calling 'mockThisFunction', the second parameter must be of type String representing the function to mock.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", function () {}, StatelessEs6Proxy);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MockThisFunctionObject 1004
  it("it should throw when the third parameter in mockThisFunction is not an object.", function () {
    testContext.setupTest = function () {
      testContext.stringInput = "Some type that is not of type Array.";
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1004): When calling 'mockThisFunction', the third parameter must be of type Object containing the function that you'd like to mock.";
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", testContext.stringInput);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // EntryPointObject 1005
  it("it should throw when the first parameter in withEntryPoint is not an object.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = "NotAnObject";
      testContext.entryPointFunction = "noProxies";
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1005): When calling 'withEntryPoint', the first parameter must be of type object representing the object that contains the function to be mocked.";
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // EntryPointString 1006
  it("it should throw when the second parameter in withEntryPoint is not of type String.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = HttpReqController;
      testContext.entryPointFunction = function () {};
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1006): When calling 'withEntryPoint', the second parameter must be of type String representing the function name that will be mocked.";
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // EntryPointFunction 1007
  it("it should throw when 'withEntryPoint' is given a function to execute doesn't exist in the given object.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = HttpReqController;
      testContext.entryPointFunction = "someFunctionNotInObject";
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1007): When calling 'withEntryPoint', the second param must be the name of a function in the first param object.";
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // ShouldBeCalledWithKeyString 1008
  it("it should throw when the first parameter in shouldBeCalledWith is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1008): When calling 'shouldBeCalledWith', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .shouldBeCalledWith({}, "shouldEqual", []);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // ShouldBeCalledWithFunctionString 1009
  it("it should throw when the second parameter in shouldBeCalledWith is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1009): When calling 'shouldBeCalledWith', the second parameter must be of type String representing the function that was mocked.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .shouldBeCalledWith("StatelessEs6Proxy", function () {}, []);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // ShouldBeCalledWithParamsArray 1010
  it("it should throw when the third parameter in shouldBeCalledWith is not of type Array.", function () {
    testContext.setupTest = function () {
      testContext.shouldBeCalledWithInput = "Some type that is not of type Array.";
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1010): When calling 'shouldBeCalledWith', the third parameter must be of type Array containing the expected parameters.";
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.shouldBeCalledWithInput);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesReturnMockName 1011
  it("it should throw when the first parameter in doesReturn is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1011): When calling 'doesReturn', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturn({}, "shouldEqual", {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesReturnFuncName 1012
  it("it should throw when the second parameter in doesReturn is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1012): When calling 'doesReturn', the second parameter must be of type String representing the function to mock.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturn("StatelessEs6Proxy", function () {}, {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesReturnPromiseMockName 1013
  it("it should throw when the first parameter in doesReturnWithPromise is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1013): When calling 'doesReturnWithPromise', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithPromise({}, "shouldEqual", {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesReturnPromiseFuncName 1014
  it("it should throw when the second parameter in doesReturnWithPromise is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1014): When calling 'doesReturnWithPromise', the second parameter must be of type String representing the function to mock.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithPromise("StatelessEs6Proxy", function () {}, {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesReturnCallbackMockName 1015
  it("it should throw when the first parameter in doesReturnWithCallback is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1015): When calling 'doesReturnWithCallback', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithCallback({}, "shouldEqual", {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesReturnCallbackFuncName 1016
  it("it should throw when the second parameter in doesReturnWithCallback is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1016): When calling 'doesReturnWithCallback', the second parameter must be of type String representing the function to mock.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithCallback("StatelessEs6Proxy", function () {}, {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesErrorMockName 1017
  it("it should throw when the first parameter in doesError is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1017): When calling 'doesError', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesError({}, "shouldEqual", {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesErrorFuncName 1018
  it("it should throw when the second parameter in doesError is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1018): When calling 'doesError', the second parameter must be of type String representing the function to mock.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesError("StatelessEs6Proxy", function () {}, {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesErrorPromiseMockName 1019
  it("it should throw when the first parameter in doesErrorWithPromise is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1019): When calling 'doesErrorWithPromise', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithPromise({}, "shouldEqual", {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesErrorPromiseFuncName 1020
  it("it should throw when the second parameter in doesErrorWithPromise is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1020): When calling 'doesErrorWithPromise', the second parameter must be of type String representing the function to mock.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithPromise("StatelessEs6Proxy", function () {}, {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesErrorCallbackMockName 1021
  it("it should throw when the first parameter in doesErrorWithCallback is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1021): When calling 'doesErrorWithCallback', the first parameter must be of type String representing the mock key.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithCallback({}, "shouldEqual", {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesErrorCallbackFuncName 1022
  it("it should throw when the second parameter in doesErrorWithCallback is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1022): When calling 'doesErrorWithCallback', the second parameter must be of type String representing the function to mock.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithCallback("StatelessEs6Proxy", function () {}, {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingTestCallback 1023
  it("it should throw when HTTPReqScenario test is not given a function to execute upon completing the test.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1023): Every test must pass in a callback to execute when the test is complete.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario().test();

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingTestCallback 1023
  it("it should throw when FromCallbackScenario test is not given a function to execute upon completing the test.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = FromCallbackController;
      testContext.entryPointFunction = "statelessEs6Proxy";
      testContext.proxyInstance = StatelessEs6Proxy;
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1023): Every test must pass in a callback to execute when the test is complete.";
    };

    testContext.setupErrorMessage();

    try {
      new FromCallbackScenario().test();

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingTestCallback 1023
  it("it should throw when FromPromiseScenario test is not given a function to execute upon completing the test.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = FromPromiseController;
      testContext.entryPointFunction = "statelessEs6Proxy";
      testContext.proxyInstance = StatelessEs6Proxy;
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1023): Every test must pass in a callback to execute when the test is complete.";
    };

    testContext.setupErrorMessage();

    try {
      new FromPromiseScenario().test();

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingTestCallback 1023
  it("it should throw when FromSynchronousScenario test is not given a function to execute upon completing the test.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = FromSynchronousController;
      testContext.entryPointFunction = "statelessEs6Proxy";
      testContext.proxyInstance = StatelessEs6Proxy;
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1023): Every test must pass in a callback to execute when the test is complete.";
    };

    testContext.setupErrorMessage();

    try {
      new FromSynchronousScenario().test();

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingEntryPoint 1024
  it("it should throw when HTTPReqScenario test is not given a valid entry point.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1024): You must define a valid entry point before executing the test.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario().test(function () {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingEntryPoint 1024
  it("it should throw when FromCallbackScenario test is not given a valid entry point.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = FromCallbackController;
      testContext.entryPointFunction = "statelessEs6Proxy";
      testContext.proxyInstance = StatelessEs6Proxy;
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1024): You must define a valid entry point before executing the test.";
    };

    testContext.setupErrorMessage();

    try {
      new FromCallbackScenario().test(function () {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingEntryPoint 1024
  it("it should throw when FromPromiseScenario test is not given a valid entry point.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = FromPromiseController;
      testContext.entryPointFunction = "statelessEs6Proxy";
      testContext.proxyInstance = StatelessEs6Proxy;
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1024): You must define a valid entry point before executing the test.";
    };

    testContext.setupErrorMessage();

    try {
      new FromPromiseScenario().test(function () {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingEntryPoint 1024
  it("it should throw when FromSynchronousScenario test is not given a valid entry point.", function () {
    testContext.setupTest = function () {
      testContext.entryPointObject = FromSynchronousController;
      testContext.entryPointFunction = "statelessEs6Proxy";
      testContext.proxyInstance = StatelessEs6Proxy;
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1024): You must define a valid entry point before executing the test.";
    };

    testContext.setupErrorMessage();

    try {
      new FromSynchronousScenario().test(function () {});

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesReturnCallbackDataToReturn 1025
  it("it should throw when the third parameter in doesReturnWithCallback is not of type Array.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1025): When calling 'doesReturnWithCallback', the third parameter must be of type Array containing the callback's parameters.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithCallback("StatelessEs6Proxy", "getFirstName", "foo");

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesAlwaysReturnCallbackDataToReturn 1026
  it("it should throw when the third parameter in doesAlwaysReturnWithCallback is not of type Array.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1026): When calling 'doesAlwaysReturnWithCallback', the third parameter must be of type Array containing the callback's parameters.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesAlwaysReturnWithCallback("StatelessEs6Proxy", "getFirstName", "foo");

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // DoesErrorCallbackDataToReturn 1027
  it("it should throw when the third parameter in doesErrorWithCallback is not of type Array.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (1027): When calling 'doesErrorWithCallback', the third parameter must be of type Array containing the callback's parameters.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithCallback("StatelessEs6Proxy", "getFirstName", "foo");

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000  && NOT DoesReturnCallbackDataToReturn 1025
  it("it should ignore when the third parameter in doesReturnWithCallback is an empty object and it should throw because the function wasn't mocked.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.getFirstName, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithCallback("StatelessEs6Proxy", "getFirstName", Maddox.constants.EmptyParameters);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000  && NOT DoesAlwaysReturnCallbackDataToReturn 1026
  it("it should ignore when the third parameter in doesAlwaysReturnWithCallback is an empty object and it should throw because the function wasn't mocked.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.getFirstName, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesAlwaysReturnWithCallback("StatelessEs6Proxy", "getFirstName", Maddox.constants.EmptyParameters);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000  && NOT DoesErrorCallbackDataToReturn 1027
  it("it should ignore when the third parameter in doesErrorWithCallback is an empty object and it should throw because the function wasn't mocked.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.getFirstName, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithCallback("StatelessEs6Proxy", "getFirstName", Maddox.constants.EmptyParameters);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when shouldBeCalledWith is given a mock that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .shouldBeCalledWith(testContext.mockName, testContext.funcName, Maddox.constants.EmptyParameters);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when shouldBeCalledWith is given a mocked function that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .shouldBeCalledWith(testContext.mockName, testContext.funcName, Maddox.constants.EmptyParameters);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesReturn is given a mock that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturn(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesReturn is given a mocked function that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .doesReturn(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesReturnWithPromise is given a mock that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithPromise(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesReturnWithPromise is given a mocked function that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .doesReturnWithPromise(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesReturnWithCallback is given a mock that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesReturnWithCallback(testContext.mockName, testContext.funcName, Maddox.constants.EmptyParameters);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesReturnWithCallback is given a mocked function that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .doesReturnWithCallback(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesError is given a mock that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesError(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesError is given a mocked function that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .doesError(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesErrorWithPromise is given a mock that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithPromise(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesErrorWithPromise is given a mocked function that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .doesErrorWithPromise(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when doesErrorWithCallback is given a mock that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .doesErrorWithCallback(testContext.mockName, testContext.funcName, Maddox.constants.EmptyParameters);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingMockThisFunction 2000
  it("it should throw when 'doesErrorWithCallback' is given a mocked function that has yet to be initialized.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "someNotMockedFunction";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2000): You must declare the mock StatelessEs6Proxy.someNotMockedFunction, using 'mockThisFunction' before declaring return values.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .doesErrorWithCallback(testContext.mockName, testContext.funcName, Maddox.constants.EmptyResult);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // FunctionNotInMock 2001
  it("it should throw when 'mockThisFunction' is given a function to mock doesn't exist in the given object.", function () {

    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = random.word();
      testContext.expectedErrorMessage = `Maddox Scenario Build Error (2001): Function ${testContext.funcName} does not exist in mock StatelessEs6Proxy.`;
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction(testContext.mockName, testContext.funcName, StatelessEs6Proxy);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MockAlreadyExists 2002
  it("it should throw when the same function is mocked more than once.", function () {
    testContext.setupErrorMessage = function () {
      testContext.mockName = "StatelessEs6Proxy";
      testContext.funcName = "getFirstName";
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (2002): Attempted to mock StatelessEs6Proxy.getFirstName, but it was already mocked.";
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction(testContext.mockName, testContext.funcName, StatelessEs6Proxy)
        .mockThisFunction(testContext.mockName, testContext.funcName, StatelessEs6Proxy);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // MissingCallback 3000
  it("it should throw when last parameter is not callback, when using '*WithCallback' and actually expecting a promise.", function (done) {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3000): When using 'doesReturnWithCallback' or 'doesErrorWithCallback' for StatelessEs6Proxy.getFirstName the last parameter in the function must be the callback function.";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithCallback("StatelessEs6Proxy", "getFirstName", [testContext.getFirstName1Result])

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // MissingCallback 3000
  it("it should throw when last parameter is not callback, when using '*WithCallback' and actually expecting a synchronous call.", function (done) {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3000): When using 'doesReturnWithCallback' or 'doesErrorWithCallback' for StatelessEs6Proxy.getMiddleName the last parameter in the function must be the callback function.";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getMiddleName", [testContext.getMiddleNameResult])

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // MissingMockedData 3001
  it("it should throw when first call to mock was not defined in test.", function (done) {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3001): Attempted to get mocked data for the first call to StatelessEs6Proxy.getFirstName, but it wasn't created in the scenario.  You are missing a 'doesReturn / doesError' call.";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // MissingMockedData 3001
  it("it should throw when second call to mock was not defined in test.", function (done) {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3001): Attempted to get mocked data for the second call to StatelessEs6Proxy.getFirstName, but it wasn't created in the scenario.  You are missing a 'doesReturn / doesError' call.";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // MockCalledWrongNumberOfTimes 3002
  it("it should throw when a mock is never called but the test expected it to be called.", function (done) {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3002): Expected the mock StatelessEs6Proxy.dummyFunction to be called 1 time(s), but it was actually called 0 time(s).";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "dummyFunction", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "dummyFunction", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "dummyFunction", testContext.getFirstName1Result)

      .test(function (err) {
        try {

          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // MockCalledWrongNumberOfTimes 3002
  it("it should throw when mock is called LESS times than expected in the test.", function (done) {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3002): Expected the mock StatelessEs6Proxy.getFirstName to be called 3 time(s), but it was actually called 2 time(s).";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // ComparisonShouldEqual 3003
  it("it should throw when expected value does not equal actual for first parameter in the first call to mock", function (done) {
    testContext.setupGetFirstName = function () {
      testContext.wrongParamValue = random.uniqueId();
      testContext.getFirstName1ParamsActual = [testContext.httpRequest.params.personId];
      testContext.getFirstName1ParamsExpected = [testContext.wrongParamValue];
      testContext.getFirstName1Result = random.firstName();

      testContext.getFirstName2Params = [testContext.httpRequest.params.personId, testContext.getFirstName1Result];
      testContext.getFirstName2Result = random.firstName();
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = `Maddox Comparison Error (3003): Failed expectation for the first param in mock StatelessEs6Proxy.getFirstName, the first time the mock was called ::::: expected '${testContext.getFirstName1ParamsActual[0]}' to deeply equal '${testContext.getFirstName1ParamsExpected[0]}'`;
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1ParamsExpected)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // ComparisonShouldEqual 3003
  it("it should throw when expected value does not equal actual for first parameter in the second call to mock", function (done) {
    testContext.setupGetFirstName = function () {
      testContext.getFirstName1Params = [testContext.httpRequest.params.personId];
      testContext.getFirstName1Result = random.firstName();

      testContext.wrongParamValue = random.uniqueId();
      testContext.getFirstName2ParamsActual = [testContext.httpRequest.params.personId, testContext.getFirstName1Result];
      testContext.getFirstName2ParamsExpected = [testContext.wrongParamValue, testContext.getFirstName1Result];

      testContext.getFirstName2Result = random.firstName();
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = `Maddox Comparison Error (3003): Failed expectation for the first param in mock StatelessEs6Proxy.getFirstName, the second time the mock was called ::::: expected '${testContext.httpRequest.params.personId}' to deeply equal '${testContext.wrongParamValue}'`;
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2ParamsExpected)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // ComparisonShouldEqual 3003
  it("it should throw when expected value does not equal actual for second parameter in the second call to mock", function (done) {
    testContext.setupGetFirstName = function () {
      testContext.getFirstName1Params = [testContext.httpRequest.params.personId];
      testContext.getFirstName1Result = random.firstName();

      testContext.wrongParamValue = random.uniqueId();
      testContext.getFirstName2ParamsActual = [testContext.httpRequest.params.personId, testContext.getFirstName1Result];
      testContext.getFirstName2ParamsExpected = [testContext.httpRequest.params.personId, testContext.wrongParamValue];

      testContext.getFirstName2Result = random.firstName();
    };
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = `Maddox Comparison Error (3003): Failed expectation for the second param in mock StatelessEs6Proxy.getFirstName, the second time the mock was called ::::: expected '${testContext.getFirstName1Result}' to deeply equal '${testContext.wrongParamValue}'`;
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2ParamsExpected)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // ComparisonShouldEqual 3003
  it("it should throw when expected Response Mock value does not equal actual Response Mock value.", function (done) {
    testContext.setupExpected = function () {
      testContext.wrongParamValue = "SOME WRONG VALUE";

      testContext.actualResponse = [{
        personId: testContext.httpRequest.params.personId,
        homeState: testContext.httpRequest.query.homeState,
        lastName: testContext.getLastNameResult[1]
      }];

      testContext.expectedResponse = [{
        personId: testContext.httpRequest.params.personId,
        homeState: testContext.httpRequest.query.homeState,
        lastName: testContext.wrongParamValue
      }];

      testContext.expectedStatusCode = [200];
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Comparison Error (3003): Failed expectation for the first param in mock HttpResponseMock.send (i.e. res.send), the first time the mock was called ::::: expected { Object (personId, homeState, ...) } to deeply equal { Object (personId, homeState, ...) }";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName1Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Params)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstName2Result)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // WrongNumberOfParams 3004
  it("it should throw when actual response mock is empty but expected contains params.", function (done) {
    testContext.setupTest = function () {
      testContext.entryPointObject = SpecialScenariosController;
      testContext.entryPointFunction = "emptyActual";
    };

    testContext.setupGetFirstName = function () {
      testContext.getFirstNameParams = [];
      testContext.getFirstNameResult = random.firstName();
    };

    testContext.setupGetMiddleName = function () {
      testContext.getMiddleNameParams = [];
      testContext.getMiddleNameResult = random.firstName();
    };

    testContext.setupGetLastName = function () {
      testContext.getLastNameParams = [];
      testContext.getLastNameResult = [undefined, random.lastName()];
    };

    testContext.setupExpected = function () {
      testContext.expectedResponse = [{
        firstName: random.uniqueId()
      }];

      testContext.expectedStatusCode = [200];
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3004): Expected the first call to HttpResponseMock.send to have 1 param(s), but it was actually called with 0 param(s).";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstNameParams)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // WrongNumberOfParams 3004
  it("it should throw when using a promise proxy function and the actual params are empty but expected contains params.", function (done) {
    testContext.setupTest = function () {
      testContext.entryPointObject = SpecialScenariosController;
      testContext.entryPointFunction = "emptyActual";
    };

    testContext.setupGetFirstName = function () {
      testContext.getFirstNameParams = [{
        firstName: random.uniqueId()
      }];
      testContext.getFirstNameResult = random.firstName();
    };

    testContext.setupGetMiddleName = function () {
      testContext.getMiddleNameParams = [];
      testContext.getMiddleNameResult = random.firstName();
    };

    testContext.setupGetLastName = function () {
      testContext.getLastNameParams = [];
      testContext.getLastNameResult = [undefined, random.lastName()];
    };

    testContext.setupExpected = function () {
      testContext.expectedResponse = [];

      testContext.expectedStatusCode = [200];
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3004): Expected the first call to StatelessEs6Proxy.getFirstName to have 1 param(s), but it was actually called with 0 param(s).";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstNameParams)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // WrongNumberOfParams 3004
  it("it should throw when using a synchronous proxy function and the actual params are empty but expected contains params.", function (done) {
    testContext.setupTest = function () {
      testContext.entryPointObject = SpecialScenariosController;
      testContext.entryPointFunction = "emptyActual";
    };

    testContext.setupGetFirstName = function () {
      testContext.getFirstNameParams = [];
      testContext.getFirstNameResult = random.firstName();
    };

    testContext.setupGetMiddleName = function () {
      testContext.getMiddleNameParams = [{
        firstName: random.uniqueId()
      }];
      testContext.getMiddleNameResult = random.firstName();
    };

    testContext.setupGetLastName = function () {
      testContext.getLastNameParams = [];
      testContext.getLastNameResult = [undefined, random.lastName()];
    };

    testContext.setupExpected = function () {
      testContext.expectedResponse = [];

      testContext.expectedStatusCode = [200];
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Runtime Error (3004): Expected the first call to StatelessEs6Proxy.getMiddleName to have 1 param(s), but it was actually called with 0 param(s).";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    new Scenario()
      .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
      .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

      .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
      .withHttpRequest(testContext.httpRequestParams)

      .resShouldBeCalledWith("send", testContext.expectedResponse)
      .resShouldBeCalledWith("status", testContext.expectedStatusCode)
      .resDoesReturnSelf("status")

      .shouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.getFirstNameParams)
      .doesReturnWithPromise("StatelessEs6Proxy", "getFirstName", testContext.getFirstNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameParams)
      .doesReturn("StatelessEs6Proxy", "getMiddleName", testContext.getMiddleNameResult)

      .shouldBeCalledWith("StatelessEs6Proxy", "getLastName", testContext.getLastNameParams)
      .doesReturnWithCallback("StatelessEs6Proxy", "getLastName", testContext.getLastNameResult)

      .test(function (err) {
        try {
          Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
          done();
        } catch (testError) {
          done(testError);
        }
      });
  });

  // ResShouldBeCalledWithFunctionString 4000
  it("it should throw when the first parameter in 'resShouldBeCalledWith' is not of type String.", function () {
    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (4001): When calling 'resShouldBeCalledWith', the second parameter must be of type Array containing the expected parameters.";
    };

    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .resShouldBeCalledWith("StatelessEs6Proxy", function () {}, []);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // ResShouldBeCalledWithParamsArray 4001
  it("it should throw when the second parameter in 'resShouldBeCalledWith' is not of type Array.", function () {
    testContext.setupTest = function () {
      testContext.shouldBeCalledWithInput = "Some type that is not of type Array.";
    };

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (4001): When calling 'resShouldBeCalledWith', the second parameter must be of type Array containing the expected parameters.";
    };

    testContext.setupTest();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .resShouldBeCalledWith("StatelessEs6Proxy", "getFirstName", testContext.shouldBeCalledWithInput);

      Maddox.compare.shouldBeUnreachable();
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }
  });

  // ExactlyOneResponseFinisher 4002
  it("it should throw when a HTTP Response Finisher function is declared more than once.", function () {

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (4002): Exactly one HTTP Response Finisher can be used per scenario. When a HTTP Response Finisher function is called, the testable code phase will end, and the validation phase will begin. Please see below for a list of HTTP Response Finishers.";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
        .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

        .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
        .withHttpRequest(testContext.httpRequestParams)

        .resShouldBeCalledWith("send", testContext.expectedResponse)
        .resShouldBeCalledWith("json", testContext.expectedResponse);
    } catch (err) {
      let possibleFinisherFunctions = "\"responseFinishers\": [\n" +
        "    \"send\",\n" +
        "    \"json\",\n" +
        "    \"jsonp\",\n" +
        "    \"redirect\",\n" +
        "    \"sendFile\",\n" +
        "    \"render\",\n" +
        "    \"sendStatus\",\n" +
        "    \"end\"\n" +
        "  ]";

      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
      Maddox.compare.shouldEqual({actual: err.stack.split(possibleFinisherFunctions).length, expected: 2});
    }

  });

  // ExactlyOneResponseFinisher 4002
  it("it should throw when a HTTP Response Finisher function is NOT declared at all.", function () {

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (4002): Exactly one HTTP Response Finisher can be used per scenario. When a HTTP Response Finisher function is called, the testable code phase will end, and the validation phase will begin. Please see below for a list of HTTP Response Finishers.";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
        .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

        .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)
        .withHttpRequest(testContext.httpRequestParams)

        .test(function () {});
    } catch (err) {
      let possibleFinisherFunctions = "\"responseFinishers\": [\n" +
        "    \"send\",\n" +
        "    \"json\",\n" +
        "    \"jsonp\",\n" +
        "    \"redirect\",\n" +
        "    \"sendFile\",\n" +
        "    \"render\",\n" +
        "    \"sendStatus\",\n" +
        "    \"end\"\n" +
        "  ]";

      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
      Maddox.compare.shouldEqual({actual: err.stack.split(possibleFinisherFunctions).length, expected: 2});
    }

  });

  // HttpReqUndefined 4003
  it("it should throw when the user has not set the HTTP Request object using the 'withHttpRequest' function.", function () {

    testContext.setupErrorMessage = function () {
      testContext.expectedErrorMessage = "Maddox Scenario Build Error (4003): You need to define the Http Request object using the 'withHttpRequest' function.";
    };

    testContext.setupTest();
    testContext.setupHttpRequest();
    testContext.setupGetFirstName();
    testContext.setupGetMiddleName();
    testContext.setupGetLastName();
    testContext.setupExpected();
    testContext.setupErrorMessage();

    try {
      new Scenario()
        .mockThisFunction("StatelessEs6Proxy", "getFirstName", StatelessEs6Proxy)
        .mockThisFunction("StatelessEs6Proxy", "getMiddleName", StatelessEs6Proxy)
        .mockThisFunction("StatelessEs6Proxy", "getLastName", StatelessEs6Proxy)

        .withEntryPoint(testContext.entryPointObject, testContext.entryPointFunction)

        .test(function () {});
    } catch (err) {
      Maddox.compare.shouldEqual({actual: err.message, expected: testContext.expectedErrorMessage});
    }

  });

});
