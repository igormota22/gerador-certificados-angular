import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LucideAward, LucideFileText } from "@lucide/angular";
import { AuthShell } from "../Shell/auth-shell";

@Component({
    imports: [RouterLink, AuthShell],
    selector: 'app-login',
    templateUrl: './login.html'
})

export class Login { }