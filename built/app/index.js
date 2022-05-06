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
// Represents the test web app that uses the AppAuthJS library.
var authorization_request_1 = require("../authorization_request");
var authorization_request_handler_1 = require("../authorization_request_handler");
var authorization_service_configuration_1 = require("../authorization_service_configuration");
var logger_1 = require("../logger");
var redirect_based_handler_1 = require("../redirect_based_handler");
var token_request_1 = require("../token_request");
var token_request_handler_1 = require("../token_request_handler");
/* an example open id connect provider */
//const openIdConnectUrl = 'https://accounts.google.com';
var openIdConnectUrl = 'https://jde.circularedge.com:5001/auth/realms/AtomIQ';
/* example client configuration */
//const clientId = '511828570984-7nmej36h9j2tebiqmpqh835naet4vci4.apps.googleusercontent.com';
var clientId = 'DI-Studio';
var redirectUri = 'http://localhost:8000/app/redirect.html';
var scope = 'openid';
/**
 * The Test application.
 */
var App = /** @class */ (function () {
    function App(snackbar) {
        var _this = this;
        this.snackbar = snackbar;
        this.notifier = new authorization_request_handler_1.AuthorizationNotifier();
        this.authorizationHandler = new redirect_based_handler_1.RedirectRequestHandler();
        this.tokenHandler = new token_request_handler_1.BaseTokenRequestHandler();
        // set notifier to deliver responses
        this.authorizationHandler.setAuthorizationNotifier(this.notifier);
        // set a listener to listen for authorization responses
        this.notifier.setAuthorizationListener(function (request, response, error) {
            logger_1.log('Authorization request complete ', request, response, error);
            if (response) {
                _this.request = request;
                _this.response = response;
                _this.code = response.code;
                _this.showMessage("Authorization Code " + response.code);
            }
        });
    }
    App.prototype.showMessage = function (message) {
        var snackbar = this.snackbar['MaterialSnackbar'];
        snackbar.showSnackbar({ message: message });
    };
    App.prototype.fetchServiceConfiguration = function () {
        var _this = this;
        authorization_service_configuration_1.AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl)
            .then(function (response) {
            logger_1.log('Fetched service configuration', response);
            _this.configuration = response;
            _this.showMessage('Completed fetching configuration');
        })
            .catch(function (error) {
            logger_1.log('Something bad happened', error);
            _this.showMessage("Something bad happened " + error);
        });
    };
    App.prototype.makeAuthorizationRequest = function () {
        // create a request
        var request = new authorization_request_1.AuthorizationRequest({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: scope,
            response_type: authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE,
            state: undefined,
            extras: { 'prompt': 'consent', 'access_type': 'offline' }
        });
        if (this.configuration) {
            this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
        }
        else {
            this.showMessage('Fetch Authorization Service configuration, before you make the authorization request.');
        }
    };
    App.prototype.makeTokenRequest = function () {
        var _this = this;
        if (!this.configuration) {
            this.showMessage('Please fetch service configuration.');
            return;
        }
        var request = null;
        if (this.code) {
            var extras = undefined;
            if (this.request && this.request.internal) {
                extras = {};
                extras['code_verifier'] = this.request.internal['code_verifier'];
            }
            // use the code to make the token request.
            request = new token_request_1.TokenRequest({
                client_id: clientId,
                redirect_uri: redirectUri,
                grant_type: token_request_1.GRANT_TYPE_AUTHORIZATION_CODE,
                code: this.code,
                refresh_token: undefined,
                extras: extras
            });
        }
        else if (this.tokenResponse) {
            // use the token response to make a request for an access token
            request = new token_request_1.TokenRequest({
                client_id: clientId,
                redirect_uri: redirectUri,
                grant_type: token_request_1.GRANT_TYPE_REFRESH_TOKEN,
                code: undefined,
                refresh_token: this.tokenResponse.refreshToken,
                extras: undefined
            });
        }
        if (request) {
            this.tokenHandler.performTokenRequest(this.configuration, request)
                .then(function (response) {
                var isFirstRequest = false;
                if (_this.tokenResponse) {
                    // copy over new fields
                    _this.tokenResponse.accessToken = response.accessToken;
                    _this.tokenResponse.issuedAt = response.issuedAt;
                    _this.tokenResponse.expiresIn = response.expiresIn;
                    _this.tokenResponse.tokenType = response.tokenType;
                    _this.tokenResponse.scope = response.scope;
                }
                else {
                    isFirstRequest = true;
                    _this.tokenResponse = response;
                }
                // unset code, so we can do refresh token exchanges subsequently
                _this.code = undefined;
                if (isFirstRequest) {
                    _this.showMessage("Obtained a refresh token " + response.refreshToken);
                }
                else {
                    _this.showMessage("Obtained an access token " + response.accessToken + ".");
                }
            })
                .catch(function (error) {
                logger_1.log('Something bad happened', error);
                _this.showMessage("Something bad happened " + error);
            });
        }
    };
    App.prototype.checkForAuthorizationResponse = function () {
        this.authorizationHandler.completeAuthorizationRequestIfPossible();
    };
    return App;
}());
exports.App = App;
// export App
window['App'] = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7O0dBWUc7OztBQUVILCtEQUErRDtBQUUvRCxrRUFBOEQ7QUFDOUQsa0ZBQW9HO0FBQ3BHLDhGQUF5RjtBQUN6RixvQ0FBOEI7QUFDOUIsb0VBQWlFO0FBQ2pFLGtEQUF1RztBQUN2RyxrRUFBc0Y7QUFzQnRGLHlDQUF5QztBQUN6Qyx5REFBeUQ7QUFDekQsSUFBTSxnQkFBZ0IsR0FBRyxzREFBc0QsQ0FBQztBQUNoRixrQ0FBa0M7QUFDbEMsOEZBQThGO0FBQzlGLElBQUssUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixJQUFNLFdBQVcsR0FBRyx5Q0FBeUMsQ0FBQztBQUM5RCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUM7QUFFdkI7O0dBRUc7QUFDSDtJQVlFLGFBQW1CLFFBQWlCO1FBQXBDLGlCQWdCQztRQWhCa0IsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUkscURBQXFCLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSwrQ0FBc0IsRUFBRSxDQUFDO1FBQ3pELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSwrQ0FBdUIsRUFBRSxDQUFDO1FBQ2xELG9DQUFvQztRQUNwQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xFLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLFVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLO1lBQzlELFlBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pFLElBQUksUUFBUSxFQUFFO2dCQUNaLEtBQUksQ0FBQyxPQUFP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O2lCQUN2RTtxQkFBTTtvQkFDTCxLQUFJLENBQUMsV0FBVyxDQUFDLDhCQUE0QixRQUFRLENBQUMsV0FBVyxNQUFHLENBQUMsQ0FBQztpQkFDdkU7WUFDSCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSztnQkFDVixZQUFHLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3JDLEtBQUksQ0FBQyxXQUFXLENBQUMsNEJBQTBCLEtBQU8sQ0FBQyxDQUFBO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1NBQ1I7SUFDSCxDQUFDO0lBRUQsMkNBQTZCLEdBQTdCO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixDQUFDLHNDQUFzQyxFQUFFLENBQUM7SUFDckUsQ0FBQztJQUNILFVBQUM7QUFBRCxDQUFDLEFBdklELElBdUlDO0FBdklZLGtCQUFHO0FBeUloQixhQUFhO0FBQ1osTUFBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0XG4gKiBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlXG4gKiBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLyBSZXByZXNlbnRzIHRoZSB0ZXN0IHdlYiBhcHAgdGhhdCB1c2VzIHRoZSBBcHBBdXRoSlMgbGlicmFyeS5cblxuaW1wb3J0IHtBdXRob3JpemF0aW9uUmVxdWVzdH0gZnJvbSAnLi4vYXV0aG9yaXphdGlvbl9yZXF1ZXN0JztcbmltcG9ydCB7QXV0aG9yaXphdGlvbk5vdGlmaWVyLCBBdXRob3JpemF0aW9uUmVxdWVzdEhhbmRsZXJ9IGZyb20gJy4uL2F1dGhvcml6YXRpb25fcmVxdWVzdF9oYW5kbGVyJztcbmltcG9ydCB7QXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9ufSBmcm9tICcuLi9hdXRob3JpemF0aW9uX3NlcnZpY2VfY29uZmlndXJhdGlvbic7XG5pbXBvcnQge2xvZ30gZnJvbSAnLi4vbG9nZ2VyJztcbmltcG9ydCB7UmVkaXJlY3RSZXF1ZXN0SGFuZGxlcn0gZnJvbSAnLi4vcmVkaXJlY3RfYmFzZWRfaGFuZGxlcic7XG5pbXBvcnQge0dSQU5UX1RZUEVfQVVUSE9SSVpBVElPTl9DT0RFLCBHUkFOVF9UWVBFX1JFRlJFU0hfVE9LRU4sIFRva2VuUmVxdWVzdH0gZnJvbSAnLi4vdG9rZW5fcmVxdWVzdCc7XG5pbXBvcnQge0Jhc2VUb2tlblJlcXVlc3RIYW5kbGVyLCBUb2tlblJlcXVlc3RIYW5kbGVyfSBmcm9tICcuLi90b2tlbl9yZXF1ZXN0X2hhbmRsZXInO1xuaW1wb3J0IHtUb2tlblJlc3BvbnNlfSBmcm9tICcuLi90b2tlbl9yZXNwb25zZSc7XG5pbXBvcnQgeyBBdXRob3JpemF0aW9uUmVzcG9uc2UgfSBmcm9tICcuLi9hdXRob3JpemF0aW9uX3Jlc3BvbnNlJztcbmltcG9ydCB7IFN0cmluZ01hcCB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogU29tZSBpbnRlcmZhY2UgZGVjbGFyYXRpb25zIGZvciBNYXRlcmlhbCBkZXNpZ24gbGl0ZS4gKi9cblxuLyoqXG4gKiBTbmFja2JhciBvcHRpb25zLlxuICovXG5kZWNsYXJlIGludGVyZmFjZSBTbmFja0Jhck9wdGlvbnMge1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIHRpbWVvdXQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHRoYXQgZGVmaW5lcyB0aGUgTURMIE1hdGVyaWFsIFNuYWNrIEJhciBBUEkuXG4gKi9cbmRlY2xhcmUgaW50ZXJmYWNlIE1hdGVyaWFsU25hY2tCYXIge1xuICBzaG93U25hY2tiYXI6IChvcHRpb25zOiBTbmFja0Jhck9wdGlvbnMpID0+IHZvaWQ7XG59XG5cbi8qIGFuIGV4YW1wbGUgb3BlbiBpZCBjb25uZWN0IHByb3ZpZGVyICovXG4vL2NvbnN0IG9wZW5JZENvbm5lY3RVcmwgPSAnaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tJztcbmNvbnN0IG9wZW5JZENvbm5lY3RVcmwgPSAnaHR0cHM6Ly9qZGUuY2lyY3VsYXJlZGdlLmNvbTo1MDAxL2F1dGgvcmVhbG1zL0F0b21JUSc7XG4vKiBleGFtcGxlIGNsaWVudCBjb25maWd1cmF0aW9uICovXG4vL2NvbnN0IGNsaWVudElkID0gJzUxMTgyODU3MDk4NC03bm1lajM2aDlqMnRlYmlxbXBxaDgzNW5hZXQ0dmNpNC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSc7XG52YXIgIGNsaWVudElkID0gJydcbmNvbnN0IHJlZGlyZWN0VXJpID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcHAvcmVkaXJlY3QuaHRtbCc7XG5jb25zdCBzY29wZSA9ICdvcGVuaWQnO1xuXG4vKipcbiAqIFRoZSBUZXN0IGFwcGxpY2F0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgQXBwIHtcbiAgcHJpdmF0ZSBub3RpZmllcjogQXV0aG9yaXphdGlvbk5vdGlmaWVyO1xuICBwcml2YXRlIGF1dGhvcml6YXRpb25IYW5kbGVyOiBBdXRob3JpemF0aW9uUmVxdWVzdEhhbmRsZXI7XG4gIHByaXZhdGUgdG9rZW5IYW5kbGVyOiBUb2tlblJlcXVlc3RIYW5kbGVyO1xuXG4gIC8vIHN0YXRlXG4gIHByaXZhdGUgY29uZmlndXJhdGlvbjogQXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9ufHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSByZXF1ZXN0OiBBdXRob3JpemF0aW9uUmVxdWVzdHx1bmRlZmluZWQ7XG4gIHByaXZhdGUgcmVzcG9uc2U6IEF1dGhvcml6YXRpb25SZXNwb25zZXx1bmRlZmluZWQ7XG4gIHByaXZhdGUgY29kZTogc3RyaW5nfHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSB0b2tlblJlc3BvbnNlOiBUb2tlblJlc3BvbnNlfHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc25hY2tiYXI6IEVsZW1lbnQpIHtcbiAgICB0aGlzLm5vdGlmaWVyID0gbmV3IEF1dGhvcml6YXRpb25Ob3RpZmllcigpO1xuICAgIHRoaXMuYXV0aG9yaXphdGlvbkhhbmRsZXIgPSBuZXcgUmVkaXJlY3RSZXF1ZXN0SGFuZGxlcigpO1xuICAgIHRoaXMudG9rZW5IYW5kbGVyID0gbmV3IEJhc2VUb2tlblJlcXVlc3RIYW5kbGVyKCk7XG4gICAgLy8gc2V0IG5vdGlmaWVyIHRvIGRlbGl2ZXIgcmVzcG9uc2VzXG4gICAgdGhpcy5hdXRob3JpemF0aW9uSGFuZGxlci5zZXRBdXRob3JpemF0aW9uTm90aWZpZXIodGhpcy5ub3RpZmllcik7XG4gICAgLy8gc2V0IGEgbGlzdGVuZXIgdG8gbGlzdGVuIGZvciBhdXRob3JpemF0aW9uIHJlc3BvbnNlc1xuICAgIHRoaXMubm90aWZpZXIuc2V0QXV0aG9yaXphdGlvbkxpc3RlbmVyKChyZXF1ZXN0LCByZXNwb25zZSwgZXJyb3IpID0+IHtcbiAgICAgIGxvZygnQXV0aG9yaXphdGlvbiByZXF1ZXN0IGNvbXBsZXRlICcsIHJlcXVlc3QsIHJlc3BvbnNlLCBlcnJvcik7XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICB0aGlzLmNvZGUgPSByZXNwb25zZS5jb2RlO1xuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBBdXRob3JpemF0aW9uIENvZGUgJHtyZXNwb25zZS5jb2RlfWApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2hvd01lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgc25hY2tiYXIgPSAodGhpcy5zbmFja2JhciBhcyBhbnkpWydNYXRlcmlhbFNuYWNrYmFyJ10gYXMgTWF0ZXJpYWxTbmFja0JhcjtcbiAgICBzbmFja2Jhci5zaG93U25hY2tiYXIoe21lc3NhZ2U6IG1lc3NhZ2V9KTtcbiAgfVxuXG4gIGZldGNoU2VydmljZUNvbmZpZ3VyYXRpb24oKSB7XG4gICAgQXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uLmZldGNoRnJvbUlzc3VlcihvcGVuSWRDb25uZWN0VXJsKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgbG9nKCdGZXRjaGVkIHNlcnZpY2UgY29uZmlndXJhdGlvbicsIHJlc3BvbnNlKTtcbiAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSByZXNwb25zZTtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKCdDb21wbGV0ZWQgZmV0Y2hpbmcgY29uZmlndXJhdGlvbicpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIGxvZygnU29tZXRoaW5nIGJhZCBoYXBwZW5lZCcsIGVycm9yKTtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBTb21ldGhpbmcgYmFkIGhhcHBlbmVkICR7ZXJyb3J9YClcbiAgICAgICAgfSk7XG4gIH1cblxuICBtYWtlQXV0aG9yaXphdGlvblJlcXVlc3QoKSB7XG4gICAgLy8gY3JlYXRlIGEgcmVxdWVzdFxuICAgIGxldCByZXF1ZXN0ID0gbmV3IEF1dGhvcml6YXRpb25SZXF1ZXN0KHtcbiAgICAgIGNsaWVudF9pZDogY2xpZW50SWQsXG4gICAgICByZWRpcmVjdF91cmk6IHJlZGlyZWN0VXJpLFxuICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgcmVzcG9uc2VfdHlwZTogQXV0aG9yaXphdGlvblJlcXVlc3QuUkVTUE9OU0VfVFlQRV9DT0RFLFxuICAgICAgc3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgIGV4dHJhczogeydwcm9tcHQnOiAnY29uc2VudCcsICdhY2Nlc3NfdHlwZSc6ICdvZmZsaW5lJ31cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb24pIHtcbiAgICAgIHRoaXMuYXV0aG9yaXphdGlvbkhhbmRsZXIucGVyZm9ybUF1dGhvcml6YXRpb25SZXF1ZXN0KHRoaXMuY29uZmlndXJhdGlvbiwgcmVxdWVzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgJ0ZldGNoIEF1dGhvcml6YXRpb24gU2VydmljZSBjb25maWd1cmF0aW9uLCBiZWZvcmUgeW91IG1ha2UgdGhlIGF1dGhvcml6YXRpb24gcmVxdWVzdC4nKTtcbiAgICB9XG4gIH1cblxuICBtYWtlVG9rZW5SZXF1ZXN0KCkge1xuICAgIGlmICghdGhpcy5jb25maWd1cmF0aW9uKSB7XG4gICAgICB0aGlzLnNob3dNZXNzYWdlKCdQbGVhc2UgZmV0Y2ggc2VydmljZSBjb25maWd1cmF0aW9uLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCByZXF1ZXN0OiBUb2tlblJlcXVlc3R8bnVsbCA9IG51bGw7XG4gICAgaWYgKHRoaXMuY29kZSkge1xuICAgICAgbGV0IGV4dHJhczogU3RyaW5nTWFwfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0aGlzLnJlcXVlc3QgJiYgdGhpcy5yZXF1ZXN0LmludGVybmFsKSB7XG4gICAgICAgIGV4dHJhcyA9IHt9O1xuICAgICAgICBleHRyYXNbJ2NvZGVfdmVyaWZpZXInXSA9IHRoaXMucmVxdWVzdC5pbnRlcm5hbFsnY29kZV92ZXJpZmllciddO1xuICAgICAgfVxuICAgICAgLy8gdXNlIHRoZSBjb2RlIHRvIG1ha2UgdGhlIHRva2VuIHJlcXVlc3QuXG4gICAgICByZXF1ZXN0ID0gbmV3IFRva2VuUmVxdWVzdCh7XG4gICAgICAgIGNsaWVudF9pZDogY2xpZW50SWQsXG4gICAgICAgIHJlZGlyZWN0X3VyaTogcmVkaXJlY3RVcmksXG4gICAgICAgIGdyYW50X3R5cGU6IEdSQU5UX1RZUEVfQVVUSE9SSVpBVElPTl9DT0RFLFxuICAgICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICAgIHJlZnJlc2hfdG9rZW46IHVuZGVmaW5lZCxcbiAgICAgICAgZXh0cmFzOiBleHRyYXNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy50b2tlblJlc3BvbnNlKSB7XG4gICAgICAvLyB1c2UgdGhlIHRva2VuIHJlc3BvbnNlIHRvIG1ha2UgYSByZXF1ZXN0IGZvciBhbiBhY2Nlc3MgdG9rZW5cbiAgICAgIHJlcXVlc3QgPSBuZXcgVG9rZW5SZXF1ZXN0KHtcbiAgICAgICAgY2xpZW50X2lkOiBjbGllbnRJZCxcbiAgICAgICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdFVyaSxcbiAgICAgICAgZ3JhbnRfdHlwZTogR1JBTlRfVFlQRV9SRUZSRVNIX1RPS0VOLFxuICAgICAgICBjb2RlOiB1bmRlZmluZWQsXG4gICAgICAgIHJlZnJlc2hfdG9rZW46IHRoaXMudG9rZW5SZXNwb25zZS5yZWZyZXNoVG9rZW4sXG4gICAgICAgIGV4dHJhczogdW5kZWZpbmVkXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdCkge1xuICAgICAgdGhpcy50b2tlbkhhbmRsZXIucGVyZm9ybVRva2VuUmVxdWVzdCh0aGlzLmNvbmZpZ3VyYXRpb24sIHJlcXVlc3QpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgbGV0IGlzRmlyc3RSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy50b2tlblJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIC8vIGNvcHkgb3ZlciBuZXcgZmllbGRzXG4gICAgICAgICAgICAgIHRoaXMudG9rZW5SZXNwb25zZS5hY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgICB0aGlzLnRva2VuUmVzcG9uc2UuaXNzdWVkQXQgPSByZXNwb25zZS5pc3N1ZWRBdDtcbiAgICAgICAgICAgICAgdGhpcy50b2tlblJlc3BvbnNlLmV4cGlyZXNJbiA9IHJlc3BvbnNlLmV4cGlyZXNJbjtcbiAgICAgICAgICAgICAgdGhpcy50b2tlblJlc3BvbnNlLnRva2VuVHlwZSA9IHJlc3BvbnNlLnRva2VuVHlwZTtcbiAgICAgICAgICAgICAgdGhpcy50b2tlblJlc3BvbnNlLnNjb3BlID0gcmVzcG9uc2Uuc2NvcGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpc0ZpcnN0UmVxdWVzdCA9IHRydWU7XG4gICAgICAgICAgICAgIHRoaXMudG9rZW5SZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnNldCBjb2RlLCBzbyB3ZSBjYW4gZG8gcmVmcmVzaCB0b2tlbiBleGNoYW5nZXMgc3Vic2VxdWVudGx5XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoaXNGaXJzdFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgT2J0YWluZWQgYSByZWZyZXNoIHRva2VuICR7cmVzcG9uc2UucmVmcmVzaFRva2VufWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgT2J0YWluZWQgYW4gYWNjZXNzIHRva2VuICR7cmVzcG9uc2UuYWNjZXNzVG9rZW59LmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIGxvZygnU29tZXRoaW5nIGJhZCBoYXBwZW5lZCcsIGVycm9yKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYFNvbWV0aGluZyBiYWQgaGFwcGVuZWQgJHtlcnJvcn1gKVxuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrRm9yQXV0aG9yaXphdGlvblJlc3BvbnNlKCkge1xuICAgIHRoaXMuYXV0aG9yaXphdGlvbkhhbmRsZXIuY29tcGxldGVBdXRob3JpemF0aW9uUmVxdWVzdElmUG9zc2libGUoKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgQXBwXG4od2luZG93IGFzIGFueSlbJ0FwcCddID0gQXBwO1xuIl19