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
var authorization_request_1 = require("./authorization_request");
describe('AuthorizationRequest Tests', function () {
    var clientId = 'client_id';
    var redirectUri = 'io.identityserver.demo:/oauthredirect';
    var scope = 'scope';
    var state = 'state';
    var extras = { key: 'value' };
    var jsonRequest = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE,
        scope: scope,
        state: state,
        extras: extras
    };
    var jsonRequest2 = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE,
        scope: scope,
        state: undefined,
        extras: extras
    };
    var jsonRequest3 = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_TOKEN,
        scope: scope,
        state: undefined,
        extras: extras
    };
    var request = new authorization_request_1.AuthorizationRequest(jsonRequest);
    var request2 = new authorization_request_1.AuthorizationRequest(jsonRequest2);
    it('Basic Authorization Request Tests', function () {
        expect(request).not.toBeNull();
        expect(request.responseType).toBe(authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE);
        expect(request.clientId).toBe(clientId);
        expect(request.redirectUri).toBe(redirectUri);
        expect(request.scope).toBe(scope);
        expect(request.state).toBe(state);
        expect(request.extras).toBeTruthy();
        expect(request.extras['key']).toBe('value');
        expect(request.extras).toEqual(extras);
    });
    it('To Json() and from Json() should work', function (done) {
        request.toJson().then(function (result) {
            var json = JSON.parse(JSON.stringify(result));
            expect(json).not.toBeNull();
            var newRequest = new authorization_request_1.AuthorizationRequest(json);
            expect(newRequest).not.toBeNull();
            expect(newRequest.responseType).toBe(authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE);
            expect(newRequest.clientId).toBe(clientId);
            expect(newRequest.redirectUri).toBe(redirectUri);
            expect(newRequest.scope).toBe(scope);
            expect(newRequest.state).toBe(state);
            expect(newRequest.extras).toBeTruthy();
            expect(newRequest.extras['key']).toBe('value');
            expect(newRequest.extras).toEqual(request.extras);
            expect(newRequest.internal).toEqual(request.internal);
            done();
        });
    });
    it('Expect cryptographic newState() to populate state', function () {
        expect(request2.state).not.toBeNull();
    });
    it('Support response_type TOKEN', function () {
        var request3 = new authorization_request_1.AuthorizationRequest(jsonRequest3);
        expect(request3.responseType).toBe(authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_TOKEN);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXphdGlvbl9yZXF1ZXN0X3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0aG9yaXphdGlvbl9yZXF1ZXN0X3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7R0FZRzs7QUFFSCxpRUFBdUY7QUFHdkYsUUFBUSxDQUFDLDRCQUE0QixFQUFFO0lBQ3JDLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQztJQUM3QixJQUFNLFdBQVcsR0FBRyx1Q0FBdUMsQ0FBQztJQUM1RCxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDdEIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ3RCLElBQU0sTUFBTSxHQUFjLEVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDO0lBRXpDLElBQUksV0FBVyxHQUE2QjtRQUMxQyxTQUFTLEVBQUUsUUFBUTtRQUNuQixZQUFZLEVBQUUsV0FBVztRQUN6QixhQUFhLEVBQUUsNENBQW9CLENBQUMsa0JBQWtCO1FBQ3RELEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLEtBQUs7UUFDWixNQUFNLEVBQUUsTUFBTTtLQUNmLENBQUM7SUFFRixJQUFJLFlBQVksR0FBNkI7UUFDM0MsU0FBUyxFQUFFLFFBQVE7UUFDbkIsWUFBWSxFQUFFLFdBQVc7UUFDekIsYUFBYSxFQUFFLDRDQUFvQixDQUFDLGtCQUFrQjtRQUN0RCxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxTQUFTO1FBQ2hCLE1BQU0sRUFBRSxNQUFNO0tBQ2YsQ0FBQztJQUVGLElBQUksWUFBWSxHQUE2QjtRQUMzQyxTQUFTLEVBQUUsUUFBUTtRQUNuQixZQUFZLEVBQUUsV0FBVztRQUN6QixhQUFhLEVBQUUsNENBQW9CLENBQUMsbUJBQW1CO1FBQ3ZELEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLFNBQVM7UUFDaEIsTUFBTSxFQUFFLE1BQU07S0FDZixDQUFDO0lBRUYsSUFB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LEVBQUU7UUFDdEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7UUFDaEMsSUFBSSxRQUFRLEdBQXlCLElBQUksNENBQW9CLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsNENBQW9CLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMvRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHRcbiAqIGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGVcbiAqIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7QXV0aG9yaXphdGlvblJlcXVlc3QsIEF1dGhvcml6YXRpb25SZXF1ZXN0SnNvbn0gZnJvbSAnLi9hdXRob3JpemF0aW9uX3JlcXVlc3QnO1xuaW1wb3J0IHtTdHJpbmdNYXB9IGZyb20gJy4vdHlwZXMnO1xuXG5kZXNjcmliZSgnQXV0aG9yaXphdGlvblJlcXVlc3QgVGVzdHMnLCAoKSA9PiB7XG4gIGNvbnN0IGNsaWVudElkID0gJ2NsaWVudF9pZCc7XG4gIGNvbnN0IHJlZGlyZWN0VXJpID0gJ2lvLmlkZW50aXR5c2VydmVyLmRlbW86L29hdXRocmVkaXJlY3QnO1xuICBjb25zdCBzY29wZSA9ICdzY29wZSc7XG4gIGNvbnN0IHN0YXRlID0gJ3N0YXRlJztcbiAgY29uc3QgZXh0cmFzOiBTdHJpbmdNYXAgPSB7a2V5OiAndmFsdWUnfTtcblxuICBsZXQganNvblJlcXVlc3Q6IEF1dGhvcml6YXRpb25SZXF1ZXN0SnNvbiA9IHtcbiAgICBjbGllbnRfaWQ6IGNsaWVudElkLFxuICAgIHJlZGlyZWN0X3VyaTogcmVkaXJlY3RVcmksXG4gICAgcmVzcG9uc2VfdHlwZTogQXV0aG9yaXphdGlvblJlcXVlc3QuUkVTUE9OU0VfVFlQRV9DT0RFLFxuICAgIHNjb3BlOiBzY29wZSxcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgZXh0cmFzOiBleHRyYXNcbiAgfTtcblxuICBsZXQganNvblJlcXVlc3QyOiBBdXRob3JpemF0aW9uUmVxdWVzdEpzb24gPSB7XG4gICAgY2xpZW50X2lkOiBjbGllbnRJZCxcbiAgICByZWRpcmVjdF91cmk6IHJlZGlyZWN0VXJpLFxuICAgIHJlc3BvbnNlX3R5cGU6IEF1dGhvcml6YXRpb25SZXF1ZXN0LlJFU1BPTlNFX1RZUEVfQ09ERSxcbiAgICBzY29wZTogc2NvcGUsXG4gICAgc3RhdGU6IHVuZGVmaW5lZCxcbiAgICBleHRyYXM6IGV4dHJhc1xuICB9O1xuXG4gIGxldCBqc29uUmVxdWVzdDM6IEF1dGhvcml6YXRpb25SZXF1ZXN0SnNvbiA9IHtcbiAgICBjbGllbnRfaWQ6IGNsaWVudElkLFxuICAgIHJlZGlyZWN0X3VyaTogcmVkaXJlY3RVcmksXG4gICAgcmVzcG9uc2VfdHlwZTogQXV0aG9yaXphdGlvblJlcXVlc3QuUkVTUE9OU0VfVFlQRV9UT0tFTixcbiAgICBzY29wZTogc2NvcGUsXG4gICAgc3RhdGU6IHVuZGVmaW5lZCxcbiAgICBleHRyYXM6IGV4dHJhc1xuICB9O1xuXG4gIGxldCByZXF1ZXN0OiBBdXRob3JpemF0aW9uUmVxdWVzdCA9IG5ldyBBdXRob3JpemF0aW9uUmVxdWVzdChqc29uUmVxdWVzdCk7XG4gIGxldCByZXF1ZXN0MjogQXV0aG9yaXphdGlvblJlcXVlc3QgPSBuZXcgQXV0aG9yaXphdGlvblJlcXVlc3QoanNvblJlcXVlc3QyKTtcblxuICBpdCgnQmFzaWMgQXV0aG9yaXphdGlvbiBSZXF1ZXN0IFRlc3RzJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXF1ZXN0KS5ub3QudG9CZU51bGwoKTtcbiAgICBleHBlY3QocmVxdWVzdC5yZXNwb25zZVR5cGUpLnRvQmUoQXV0aG9yaXphdGlvblJlcXVlc3QuUkVTUE9OU0VfVFlQRV9DT0RFKTtcbiAgICBleHBlY3QocmVxdWVzdC5jbGllbnRJZCkudG9CZShjbGllbnRJZCk7XG4gICAgZXhwZWN0KHJlcXVlc3QucmVkaXJlY3RVcmkpLnRvQmUocmVkaXJlY3RVcmkpO1xuICAgIGV4cGVjdChyZXF1ZXN0LnNjb3BlKS50b0JlKHNjb3BlKTtcbiAgICBleHBlY3QocmVxdWVzdC5zdGF0ZSkudG9CZShzdGF0ZSk7XG4gICAgZXhwZWN0KHJlcXVlc3QuZXh0cmFzKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KHJlcXVlc3QuZXh0cmFzIVsna2V5J10pLnRvQmUoJ3ZhbHVlJyk7XG4gICAgZXhwZWN0KHJlcXVlc3QuZXh0cmFzKS50b0VxdWFsKGV4dHJhcyk7XG4gIH0pO1xuXG4gIGl0KCdUbyBKc29uKCkgYW5kIGZyb20gSnNvbigpIHNob3VsZCB3b3JrJywgKGRvbmU6IERvbmVGbikgPT4ge1xuICAgIHJlcXVlc3QudG9Kc29uKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgbGV0IGpzb24gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgZXhwZWN0KGpzb24pLm5vdC50b0JlTnVsbCgpO1xuICAgICAgbGV0IG5ld1JlcXVlc3QgPSBuZXcgQXV0aG9yaXphdGlvblJlcXVlc3QoanNvbik7XG4gICAgICBleHBlY3QobmV3UmVxdWVzdCkubm90LnRvQmVOdWxsKCk7XG4gICAgICBleHBlY3QobmV3UmVxdWVzdC5yZXNwb25zZVR5cGUpLnRvQmUoQXV0aG9yaXphdGlvblJlcXVlc3QuUkVTUE9OU0VfVFlQRV9DT0RFKTtcbiAgICAgIGV4cGVjdChuZXdSZXF1ZXN0LmNsaWVudElkKS50b0JlKGNsaWVudElkKTtcbiAgICAgIGV4cGVjdChuZXdSZXF1ZXN0LnJlZGlyZWN0VXJpKS50b0JlKHJlZGlyZWN0VXJpKTtcbiAgICAgIGV4cGVjdChuZXdSZXF1ZXN0LnNjb3BlKS50b0JlKHNjb3BlKTtcbiAgICAgIGV4cGVjdChuZXdSZXF1ZXN0LnN0YXRlKS50b0JlKHN0YXRlKTtcbiAgICAgIGV4cGVjdChuZXdSZXF1ZXN0LmV4dHJhcykudG9CZVRydXRoeSgpO1xuICAgICAgZXhwZWN0KG5ld1JlcXVlc3QuZXh0cmFzIVsna2V5J10pLnRvQmUoJ3ZhbHVlJyk7XG4gICAgICBleHBlY3QobmV3UmVxdWVzdC5leHRyYXMpLnRvRXF1YWwocmVxdWVzdC5leHRyYXMpO1xuICAgICAgZXhwZWN0KG5ld1JlcXVlc3QuaW50ZXJuYWwpLnRvRXF1YWwocmVxdWVzdC5pbnRlcm5hbCk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdFeHBlY3QgY3J5cHRvZ3JhcGhpYyBuZXdTdGF0ZSgpIHRvIHBvcHVsYXRlIHN0YXRlJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXF1ZXN0Mi5zdGF0ZSkubm90LnRvQmVOdWxsKCk7XG4gIH0pO1xuXG4gIGl0KCdTdXBwb3J0IHJlc3BvbnNlX3R5cGUgVE9LRU4nLCAoKSA9PiB7XG4gICAgbGV0IHJlcXVlc3QzOiBBdXRob3JpemF0aW9uUmVxdWVzdCA9IG5ldyBBdXRob3JpemF0aW9uUmVxdWVzdChqc29uUmVxdWVzdDMpO1xuICAgIGV4cGVjdChyZXF1ZXN0My5yZXNwb25zZVR5cGUpLnRvQmUoQXV0aG9yaXphdGlvblJlcXVlc3QuUkVTUE9OU0VfVFlQRV9UT0tFTik7XG4gIH0pO1xufSk7XG4iXX0=