import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LucideAward, LucideFileText } from "@lucide/angular";

@Component({
    imports: [LucideAward, LucideFileText, RouterLink],
    selector: "app-auth-shell",
    templateUrl: "./auth-shell.html"
})

export class AuthShell { }