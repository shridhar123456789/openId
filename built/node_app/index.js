"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
// Represents a Node application, that uses the AppAuthJS library.
var authorization_request_1 = require("../authorization_request");
var authorization_request_handler_1 = require("../authorization_request_handler");
var authorization_service_configuration_1 = require("../authorization_service_configuration");
var logger_1 = require("../logger");
var node_support_1 = require("../node_support");
var node_requestor_1 = require("../node_support/node_requestor");
var node_request_handler_1 = require("../node_support/node_request_handler");
var revoke_token_request_1 = require("../revoke_token_request");
var token_request_1 = require("../token_request");
var token_request_handler_1 = require("../token_request_handler");
var PORT = 32111;
/* the Node.js based HTTP client. */
var requestor = new node_requestor_1.NodeRequestor();
/* an example open id connect provider */
//const openIdConnectUrl = 'https://accounts.google.com';
var openIdConnectUrl = "https://jde.circularedge.com:5001/auth/realms/AtomIQ";
/* example client configuration */
//const clientId = '511828570984-7nmej36h9j2tebiqmpqh835naet4vci4.apps.googleusercontent.com';
var clientId = "";
var redirectUri = "http://127.0.0.1:" + PORT;
var scope = "openid";
var App = /** @class */ (function () {
  function App() {
    var _this = this;
    this.notifier = new authorization_request_handler_1.AuthorizationNotifier();
    this.authorizationHandler = new node_request_handler_1.NodeBasedHandler(
      PORT
    );
    this.tokenHandler = new token_request_handler_1.BaseTokenRequestHandler(
      requestor
    );
    // set notifier to deliver responses
    this.authorizationHandler.setAuthorizationNotifier(this.notifier);
    // set a listener to listen for authorization responses
    // make refresh and access token requests.
    this.notifier.setAuthorizationListener(function (request, response, error) {
      logger_1.log("Authorization request complete ", request, response, error);
      if (response) {
        _this
          .makeRefreshTokenRequest(_this.configuration, request, response)
          .then(function (result) {
            return _this.makeAccessTokenRequest(
              _this.configuration,
              result.refreshToken
            );
          })
          .then(function () {
            return logger_1.log("All done.");
          });
      }
    });
  }
  App.prototype.fetchServiceConfiguration = function () {
    return authorization_service_configuration_1.AuthorizationServiceConfiguration.fetchFromIssuer(
      openIdConnectUrl,
      requestor
    ).then(function (response) {
      logger_1.log("Fetched service configuration", response);
      return response;
    });
  };
  App.prototype.makeAuthorizationRequest = function (configuration) {
    // create a request
    var request = new authorization_request_1.AuthorizationRequest(
      {
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        response_type:
          authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE,
      },
      new node_support_1.NodeCrypto()
    );
    logger_1.log("Making authorization request ", configuration, request);
    this.authorizationHandler.performAuthorizationRequest(
      configuration,
      request
    );
  };
  App.prototype.makeRefreshTokenRequest = function (
    configuration,
    request,
    response
  ) {
    var extras = undefined;
    if (request && request.internal) {
      extras = {};
      extras["code_verifier"] = request.internal["code_verifier"];
    }
    var tokenRequest = new token_request_1.TokenRequest({
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: token_request_1.GRANT_TYPE_AUTHORIZATION_CODE,
      code: response.code,
      refresh_token: undefined,
      extras: extras,
    });
    return this.tokenHandler
      .performTokenRequest(configuration, tokenRequest)
      .then(function (response) {
        logger_1.log("Refresh Token is " + response.refreshToken);
        return response;
      });
  };
  App.prototype.makeAccessTokenRequest = function (
    configuration,
    refreshToken
  ) {
    var request = new token_request_1.TokenRequest({
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: token_request_1.GRANT_TYPE_REFRESH_TOKEN,
      code: undefined,
      refresh_token: refreshToken,
      extras: undefined,
    });
    return this.tokenHandler
      .performTokenRequest(configuration, request)
      .then(function (response) {
        logger_1.log(
          "Access Token is " +
            response.accessToken +
            ", Id Token is " +
            response.idToken
        );
        return response;
      });
  };
  App.prototype.makeRevokeTokenRequest = function (
    configuration,
    refreshToken
  ) {
    var request = new revoke_token_request_1.RevokeTokenRequest({
      token: refreshToken,
    });
    return this.tokenHandler
      .performRevokeTokenRequest(configuration, request)
      .then(function (response) {
        logger_1.log("revoked refreshToken");
        return response;
      });
  };
  return App;
})();
exports.App = App;
logger_1.log("Application is ready.");
var app = new App();
app
  .fetchServiceConfiguration()
  .then(function (configuration) {
    app.configuration = configuration;
    app.makeAuthorizationRequest(configuration);
    // notifier makes token requests.
  })
  .catch(function (error) {
    logger_1.log("Something bad happened ", error);
  });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZV9hcHAvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7R0FZRzs7O0FBRUgsa0VBQWtFO0FBRWxFLGtFQUFnRTtBQUNoRSxrRkFBc0c7QUFFdEcsOEZBQTJGO0FBQzNGLG9DQUFnQztBQUNoQyxnREFBNkM7QUFDN0MsaUVBQStEO0FBQy9ELDZFQUF3RTtBQUN4RSxnRUFBNkQ7QUFDN0Qsa0RBQXlHO0FBQ3pHLGtFQUF3RjtBQUd4RixJQUFNLElBQUksR0FBRyxLQUFLLENBQUM7QUFFbkIsb0NBQW9DO0FBQ3BDLElBQU0sU0FBUyxHQUFHLElBQUksOEJBQWEsRUFBRSxDQUFDO0FBRXRDLHlDQUF5QztBQUN6Qyx5REFBeUQ7QUFDekQsSUFBTSxnQkFBZ0IsR0FBRyxzREFBc0QsQ0FBQztBQUVoRixrQ0FBa0M7QUFDbEMsOEZBQThGO0FBQzlGLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQztBQUM3QixJQUFNLFdBQVcsR0FBRyxzQkFBb0IsSUFBTSxDQUFDO0FBQy9DLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUV2QjtJQVFFO1FBQUEsaUJBZ0JDO1FBZkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHFEQUFxQixFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksdUNBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLCtDQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNELG9DQUFvQztRQUNwQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xFLHVEQUF1RDtRQUN2RCwwQ0FBMEM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSztZQUM5RCxZQUFHLENBQUMsaUNBQWlDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqRSxJQUFJLFFBQVEsRUFBRTtnQkFDWixLQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSSxDQUFDLGFBQWMsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO3FCQUMvRCxJQUFJLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxLQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSSxDQUFDLGFBQWMsRUFBRSxNQUFNLENBQUMsWUFBYSxDQUFDLEVBQXRFLENBQXNFLENBQUM7cUJBQ3RGLElBQUksQ0FBQyxjQUFNLE9BQUEsWUFBRyxDQUFDLFdBQVcsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7YUFDbkM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx1Q0FBeUIsR0FBekI7UUFDRSxPQUFPLHVFQUFpQyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUM7YUFDaEYsSUFBSSxDQUFDLFVBQUEsUUFBUTtZQUNaLFlBQUcsQ0FBQywrQkFBK0IsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvQyxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCxzQ0FBd0IsR0FBeEIsVUFBeUIsYUFBZ0Q7UUFDdkUsbUJBQW1CO1FBQ25CLElBQUksT0FBTyxHQUFHLElBQUksNENBQW9CLENBQUM7WUFDckMsU0FBUyxFQUFFLFFBQVE7WUFDbkIsWUFBWSxFQUFFLFdBQVc7WUFDekIsS0FBSyxFQUFFLEtBQUs7WUFDWixhQUFhLEVBQUUsNENBQW9CLENBQUMsa0JBQWtCO1lBQ3RELEtBQUssRUFBRSxTQUFTO1lBQ2hCLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBQztTQUN4RCxFQUFFLElBQUkseUJBQVUsRUFBRSxDQUFDLENBQUM7UUFFckIsWUFBRyxDQUFDLCtCQUErQixFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsMkJBQTJCLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxxQ0FBdUIsR0FBdkIsVUFDSSxhQUFnRCxFQUNoRCxPQUE2QixFQUM3QixRQUErQjtRQUVqQyxJQUFJLE1BQU0sR0FBd0IsU0FBUyxDQUFDO1FBQzVDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDL0IsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNaLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsSUFBSSxZQUFZLEdBQUcsSUFBSSw0QkFBWSxDQUFDO1lBQ2xDLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFlBQVksRUFBRSxXQUFXO1lBQ3pCLFVBQVUsRUFBRSw2Q0FBNkI7WUFDekMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1lBQ25CLGFBQWEsRUFBRSxTQUFTO1lBQ3hCLE1BQU0sRUFBRSxNQUFNO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ3JGLFlBQUcsQ0FBQyxzQkFBb0IsUUFBUSxDQUFDLFlBQWMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9DQUFzQixHQUF0QixVQUF1QixhQUFnRCxFQUFFLFlBQW9CO1FBQzNGLElBQUksT0FBTyxHQUFHLElBQUksNEJBQVksQ0FBQztZQUM3QixTQUFTLEVBQUUsUUFBUTtZQUNuQixZQUFZLEVBQUUsV0FBVztZQUN6QixVQUFVLEVBQUUsd0NBQXdCO1lBQ3BDLElBQUksRUFBRSxTQUFTO1lBQ2YsYUFBYSxFQUFFLFlBQVk7WUFDM0IsTUFBTSxFQUFFLFNBQVM7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ2hGLFlBQUcsQ0FBQyxxQkFBbUIsUUFBUSxDQUFDLFdBQVcsc0JBQWlCLFFBQVEsQ0FBQyxPQUFTLENBQUMsQ0FBQztZQUNoRixPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvQ0FBc0IsR0FBdEIsVUFBdUIsYUFBZ0QsRUFBRSxZQUFvQjtRQUMzRixJQUFJLE9BQU8sR0FBRyxJQUFJLHlDQUFrQixDQUFDLEVBQUMsS0FBSyxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7UUFFNUQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ3RGLFlBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILFVBQUM7QUFBRCxDQUFDLEFBbkdELElBbUdDO0FBbkdZLGtCQUFHO0FBcUdoQixZQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM3QixJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRXRCLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRTtLQUMxQixJQUFJLENBQUMsVUFBQSxhQUFhO0lBQ2pCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ2xDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM1QyxpQ0FBaUM7QUFDbkMsQ0FBQyxDQUFDO0tBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSztJQUNWLFlBQUcsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0XG4gKiBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlXG4gKiBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLyBSZXByZXNlbnRzIGEgTm9kZSBhcHBsaWNhdGlvbiwgdGhhdCB1c2VzIHRoZSBBcHBBdXRoSlMgbGlicmFyeS5cblxuaW1wb3J0IHsgQXV0aG9yaXphdGlvblJlcXVlc3QgfSBmcm9tICcuLi9hdXRob3JpemF0aW9uX3JlcXVlc3QnO1xuaW1wb3J0IHsgQXV0aG9yaXphdGlvbk5vdGlmaWVyLCBBdXRob3JpemF0aW9uUmVxdWVzdEhhbmRsZXIgfSBmcm9tICcuLi9hdXRob3JpemF0aW9uX3JlcXVlc3RfaGFuZGxlcic7XG5pbXBvcnQgeyBBdXRob3JpemF0aW9uUmVzcG9uc2UgfSBmcm9tICcuLi9hdXRob3JpemF0aW9uX3Jlc3BvbnNlJztcbmltcG9ydCB7IEF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2F1dGhvcml6YXRpb25fc2VydmljZV9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgeyBOb2RlQ3J5cHRvIH0gZnJvbSAnLi4vbm9kZV9zdXBwb3J0JztcbmltcG9ydCB7IE5vZGVSZXF1ZXN0b3IgfSBmcm9tICcuLi9ub2RlX3N1cHBvcnQvbm9kZV9yZXF1ZXN0b3InO1xuaW1wb3J0IHsgTm9kZUJhc2VkSGFuZGxlciB9IGZyb20gJy4uL25vZGVfc3VwcG9ydC9ub2RlX3JlcXVlc3RfaGFuZGxlcic7XG5pbXBvcnQgeyBSZXZva2VUb2tlblJlcXVlc3QgfSBmcm9tICcuLi9yZXZva2VfdG9rZW5fcmVxdWVzdCc7XG5pbXBvcnQgeyBHUkFOVF9UWVBFX0FVVEhPUklaQVRJT05fQ09ERSwgR1JBTlRfVFlQRV9SRUZSRVNIX1RPS0VOLCBUb2tlblJlcXVlc3QgfSBmcm9tICcuLi90b2tlbl9yZXF1ZXN0JztcbmltcG9ydCB7IEJhc2VUb2tlblJlcXVlc3RIYW5kbGVyLCBUb2tlblJlcXVlc3RIYW5kbGVyIH0gZnJvbSAnLi4vdG9rZW5fcmVxdWVzdF9oYW5kbGVyJztcbmltcG9ydCB7IFN0cmluZ01hcCB9IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgUE9SVCA9IDMyMTExO1xuXG4vKiB0aGUgTm9kZS5qcyBiYXNlZCBIVFRQIGNsaWVudC4gKi9cbmNvbnN0IHJlcXVlc3RvciA9IG5ldyBOb2RlUmVxdWVzdG9yKCk7XG5cbi8qIGFuIGV4YW1wbGUgb3BlbiBpZCBjb25uZWN0IHByb3ZpZGVyICovXG4vL2NvbnN0IG9wZW5JZENvbm5lY3RVcmwgPSAnaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tJztcbmNvbnN0IG9wZW5JZENvbm5lY3RVcmwgPSAnaHR0cHM6Ly9qZGUuY2lyY3VsYXJlZGdlLmNvbTo1MDAxL2F1dGgvcmVhbG1zL0F0b21JUSc7XG5cbi8qIGV4YW1wbGUgY2xpZW50IGNvbmZpZ3VyYXRpb24gKi9cbi8vY29uc3QgY2xpZW50SWQgPSAnNTExODI4NTcwOTg0LTdubWVqMzZoOWoydGViaXFtcHFoODM1bmFldDR2Y2k0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJztcbmNvbnN0IGNsaWVudElkID0gJ0RJLVN0dWRpbyc7XG5jb25zdCByZWRpcmVjdFVyaSA9IGBodHRwOi8vMTI3LjAuMC4xOiR7UE9SVH1gO1xuY29uc3Qgc2NvcGUgPSAnb3BlbmlkJztcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG4gIHByaXZhdGUgbm90aWZpZXI6IEF1dGhvcml6YXRpb25Ob3RpZmllcjtcbiAgcHJpdmF0ZSBhdXRob3JpemF0aW9uSGFuZGxlcjogQXV0aG9yaXphdGlvblJlcXVlc3RIYW5kbGVyO1xuICBwcml2YXRlIHRva2VuSGFuZGxlcjogVG9rZW5SZXF1ZXN0SGFuZGxlcjtcblxuICAvLyBzdGF0ZVxuICBjb25maWd1cmF0aW9uOiBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb258dW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubm90aWZpZXIgPSBuZXcgQXV0aG9yaXphdGlvbk5vdGlmaWVyKCk7XG4gICAgdGhpcy5hdXRob3JpemF0aW9uSGFuZGxlciA9IG5ldyBOb2RlQmFzZWRIYW5kbGVyKFBPUlQpO1xuICAgIHRoaXMudG9rZW5IYW5kbGVyID0gbmV3IEJhc2VUb2tlblJlcXVlc3RIYW5kbGVyKHJlcXVlc3Rvcik7XG4gICAgLy8gc2V0IG5vdGlmaWVyIHRvIGRlbGl2ZXIgcmVzcG9uc2VzXG4gICAgdGhpcy5hdXRob3JpemF0aW9uSGFuZGxlci5zZXRBdXRob3JpemF0aW9uTm90aWZpZXIodGhpcy5ub3RpZmllcik7XG4gICAgLy8gc2V0IGEgbGlzdGVuZXIgdG8gbGlzdGVuIGZvciBhdXRob3JpemF0aW9uIHJlc3BvbnNlc1xuICAgIC8vIG1ha2UgcmVmcmVzaCBhbmQgYWNjZXNzIHRva2VuIHJlcXVlc3RzLlxuICAgIHRoaXMubm90aWZpZXIuc2V0QXV0aG9yaXphdGlvbkxpc3RlbmVyKChyZXF1ZXN0LCByZXNwb25zZSwgZXJyb3IpID0+IHtcbiAgICAgIGxvZygnQXV0aG9yaXphdGlvbiByZXF1ZXN0IGNvbXBsZXRlICcsIHJlcXVlc3QsIHJlc3BvbnNlLCBlcnJvcik7XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5tYWtlUmVmcmVzaFRva2VuUmVxdWVzdCh0aGlzLmNvbmZpZ3VyYXRpb24hLCByZXF1ZXN0LCByZXNwb25zZSlcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB0aGlzLm1ha2VBY2Nlc3NUb2tlblJlcXVlc3QodGhpcy5jb25maWd1cmF0aW9uISwgcmVzdWx0LnJlZnJlc2hUb2tlbiEpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gbG9nKCdBbGwgZG9uZS4nKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmZXRjaFNlcnZpY2VDb25maWd1cmF0aW9uKCk6IFByb21pc2U8QXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uPiB7XG4gICAgcmV0dXJuIEF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbi5mZXRjaEZyb21Jc3N1ZXIob3BlbklkQ29ubmVjdFVybCwgcmVxdWVzdG9yKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgbG9nKCdGZXRjaGVkIHNlcnZpY2UgY29uZmlndXJhdGlvbicsIHJlc3BvbnNlKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgbWFrZUF1dGhvcml6YXRpb25SZXF1ZXN0KGNvbmZpZ3VyYXRpb246IEF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbikge1xuICAgIC8vIGNyZWF0ZSBhIHJlcXVlc3RcbiAgICBsZXQgcmVxdWVzdCA9IG5ldyBBdXRob3JpemF0aW9uUmVxdWVzdCh7XG4gICAgICBjbGllbnRfaWQ6IGNsaWVudElkLFxuICAgICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdFVyaSxcbiAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgIHJlc3BvbnNlX3R5cGU6IEF1dGhvcml6YXRpb25SZXF1ZXN0LlJFU1BPTlNFX1RZUEVfQ09ERSxcbiAgICAgIHN0YXRlOiB1bmRlZmluZWQsXG4gICAgICBleHRyYXM6IHsncHJvbXB0JzogJ2NvbnNlbnQnLCAnYWNjZXNzX3R5cGUnOiAnb2ZmbGluZSd9XG4gICAgfSwgbmV3IE5vZGVDcnlwdG8oKSk7XG5cbiAgICBsb2coJ01ha2luZyBhdXRob3JpemF0aW9uIHJlcXVlc3QgJywgY29uZmlndXJhdGlvbiwgcmVxdWVzdCk7XG4gICAgdGhpcy5hdXRob3JpemF0aW9uSGFuZGxlci5wZXJmb3JtQXV0aG9yaXphdGlvblJlcXVlc3QoY29uZmlndXJhdGlvbiwgcmVxdWVzdCk7XG4gIH1cblxuICBtYWtlUmVmcmVzaFRva2VuUmVxdWVzdChcbiAgICAgIGNvbmZpZ3VyYXRpb246IEF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbixcbiAgICAgIHJlcXVlc3Q6IEF1dGhvcml6YXRpb25SZXF1ZXN0LFxuICAgICAgcmVzcG9uc2U6IEF1dGhvcml6YXRpb25SZXNwb25zZSkge1xuICAgIFxuICAgIGxldCBleHRyYXM6IFN0cmluZ01hcHx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHJlcXVlc3QgJiYgcmVxdWVzdC5pbnRlcm5hbCkge1xuICAgICAgZXh0cmFzID0ge307XG4gICAgICBleHRyYXNbJ2NvZGVfdmVyaWZpZXInXSA9IHJlcXVlc3QuaW50ZXJuYWxbJ2NvZGVfdmVyaWZpZXInXTtcbiAgICB9XG5cbiAgICBsZXQgdG9rZW5SZXF1ZXN0ID0gbmV3IFRva2VuUmVxdWVzdCh7XG4gICAgICBjbGllbnRfaWQ6IGNsaWVudElkLFxuICAgICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdFVyaSxcbiAgICAgIGdyYW50X3R5cGU6IEdSQU5UX1RZUEVfQVVUSE9SSVpBVElPTl9DT0RFLFxuICAgICAgY29kZTogcmVzcG9uc2UuY29kZSxcbiAgICAgIHJlZnJlc2hfdG9rZW46IHVuZGVmaW5lZCxcbiAgICAgIGV4dHJhczogZXh0cmFzXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy50b2tlbkhhbmRsZXIucGVyZm9ybVRva2VuUmVxdWVzdChjb25maWd1cmF0aW9uLCB0b2tlblJlcXVlc3QpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbG9nKGBSZWZyZXNoIFRva2VuIGlzICR7cmVzcG9uc2UucmVmcmVzaFRva2VufWApO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9XG5cbiAgbWFrZUFjY2Vzc1Rva2VuUmVxdWVzdChjb25maWd1cmF0aW9uOiBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb24sIHJlZnJlc2hUb2tlbjogc3RyaW5nKSB7XG4gICAgbGV0IHJlcXVlc3QgPSBuZXcgVG9rZW5SZXF1ZXN0KHtcbiAgICAgIGNsaWVudF9pZDogY2xpZW50SWQsXG4gICAgICByZWRpcmVjdF91cmk6IHJlZGlyZWN0VXJpLFxuICAgICAgZ3JhbnRfdHlwZTogR1JBTlRfVFlQRV9SRUZSRVNIX1RPS0VOLFxuICAgICAgY29kZTogdW5kZWZpbmVkLFxuICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgZXh0cmFzOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLnRva2VuSGFuZGxlci5wZXJmb3JtVG9rZW5SZXF1ZXN0KGNvbmZpZ3VyYXRpb24sIHJlcXVlc3QpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbG9nKGBBY2Nlc3MgVG9rZW4gaXMgJHtyZXNwb25zZS5hY2Nlc3NUb2tlbn0sIElkIFRva2VuIGlzICR7cmVzcG9uc2UuaWRUb2tlbn1gKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfVxuXG4gIG1ha2VSZXZva2VUb2tlblJlcXVlc3QoY29uZmlndXJhdGlvbjogQXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uLCByZWZyZXNoVG9rZW46IHN0cmluZykge1xuICAgIGxldCByZXF1ZXN0ID0gbmV3IFJldm9rZVRva2VuUmVxdWVzdCh7dG9rZW46IHJlZnJlc2hUb2tlbn0pO1xuXG4gICAgcmV0dXJuIHRoaXMudG9rZW5IYW5kbGVyLnBlcmZvcm1SZXZva2VUb2tlblJlcXVlc3QoY29uZmlndXJhdGlvbiwgcmVxdWVzdCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsb2coJ3Jldm9rZWQgcmVmcmVzaFRva2VuJyk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH1cbn1cblxubG9nKCdBcHBsaWNhdGlvbiBpcyByZWFkeS4nKTtcbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuYXBwLmZldGNoU2VydmljZUNvbmZpZ3VyYXRpb24oKVxuICAgIC50aGVuKGNvbmZpZ3VyYXRpb24gPT4ge1xuICAgICAgYXBwLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uO1xuICAgICAgYXBwLm1ha2VBdXRob3JpemF0aW9uUmVxdWVzdChjb25maWd1cmF0aW9uKTtcbiAgICAgIC8vIG5vdGlmaWVyIG1ha2VzIHRva2VuIHJlcXVlc3RzLlxuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGxvZygnU29tZXRoaW5nIGJhZCBoYXBwZW5lZCAnLCBlcnJvcik7XG4gICAgfSk7XG4iXX0=
