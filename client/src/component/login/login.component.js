"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var toolbox_service_1 = require("../service/toolbox.service");
var connexion_service_1 = require("../service/connexion.service");
var translate_service_1 = require("../service/translate.service");
var database_service_1 = require("../service/database.service");
var LoginComponent = (function () {
    function LoginComponent(toolboxService, connexionService, translateService) {
        this.toolboxService = toolboxService;
        this.connexionService = connexionService;
        this.translateService = translateService;
        this.connected = new core_1.EventEmitter();
        this.disconnected = new core_1.EventEmitter();
        this.connexionFailure = function (data) {
            this.connexionMessage = this.translateService.translate("Connexion not succeded");
            this.connexion = null;
            this.disconnected.emit(null);
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.connexion = this.connexionService.getConnexion();
    };
    LoginComponent.prototype.translate = function (text) {
        return this.translateService.translate(text);
    };
    LoginComponent.prototype.connect = function () {
        var _this = this;
        this.connexionService.connect(function (data) { return _this.connexionSuccess(data); }, function (data) { return _this.connexionFailure(data); }, this.login, this.password, this.rememberMe);
    };
    LoginComponent.prototype.connexionSuccess = function (connexion) {
        this.connexionMessage = this.translateService.translate("Connexion succeded");
        this.connexion = this.connexionService.getConnexion();
        this.connected.emit(this.connexion);
    };
    LoginComponent.prototype.disconnect = function () {
        this.connexionService.disconnect();
        this.connexion = null;
        this.disconnected.emit(null);
    };
    return LoginComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], LoginComponent.prototype, "connected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], LoginComponent.prototype, "disconnected", void 0);
LoginComponent = __decorate([
    core_1.Component({
        selector: 'login',
        templateUrl: '/app/view/login.component.html',
        providers: [toolbox_service_1.ToolboxService, connexion_service_1.ConnexionService, translate_service_1.TranslateService, database_service_1.DatabaseService]
    }),
    __metadata("design:paramtypes", [toolbox_service_1.ToolboxService, connexion_service_1.ConnexionService, translate_service_1.TranslateService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map