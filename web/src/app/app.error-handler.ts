import { HttpErrorResponse } from '@angular/common/http'
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core'
import { NotificationService } from './shared/notification.service'

@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {
    constructor(private ns: NotificationService,
        private injector: Injector,
        private zone: NgZone) {
        super()
    }

    handleError(errorResponse: Response | any) {
        if (errorResponse instanceof HttpErrorResponse) {
            const message = errorResponse.error.message

            this.zone.run(() => {
                switch (errorResponse.status) {
                    case 401:
                        this.ns.notify(message || 'Usuário Não Autenticado')
                        break;
                    case 403:
                        this.ns.notify(message || 'Não Autorizado')
                        break;
                    case 404:
                        this.ns.notify(message || 'Recurso não encontrado. Verifique o console para mais detalhes')
                        break;
                }
            })
        }
        super.handleError(errorResponse)
    }
}