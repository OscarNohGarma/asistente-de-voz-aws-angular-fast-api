import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor() {}

  success(message: string, title: string = 'Éxito') {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'Aceptar',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const popup = Swal.getPopup();
        popup!.style.borderRadius = '12px';
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#5b21b6';
          confirmButton.style.borderRadius = '8px';
          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#4c1d95'; // Color en hover
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#5b21b6'; // Color normal
          };
        }
      },
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'Aceptar',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const popup = Swal.getPopup();
        popup!.style.borderRadius = '12px';
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#5b21b6';
          confirmButton.style.borderRadius = '8px';
          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#4c1d95'; // Color en hover
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#5b21b6'; // Color normal
          };
        }
      },
    });
  }

  warning(message: string, title: string = 'Advertencia') {
    Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonText: 'Aceptar',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const popup = Swal.getPopup();
        popup!.style.borderRadius = '12px';
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#5b21b6';
          confirmButton.style.borderRadius = '8px';
          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#4c1d95'; // Color en hover
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#5b21b6'; // Color normal
          };
        }
      },
    });
  }

  info(message: string, title: string = 'Información') {
    Swal.fire({
      icon: 'info',
      title,
      text: message,
      confirmButtonColor: '#5bc0de',
      confirmButtonText: 'Aceptar',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const popup = Swal.getPopup();
        popup!.style.borderRadius = '12px';
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#5b21b6';
          confirmButton.style.borderRadius = '8px';
          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#4c1d95'; // Color en hover
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#5b21b6'; // Color normal
          };
        }
      },
    });
  }

  confirm(message: string, title: string = '¿Estás seguro?'): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const popup = Swal.getPopup();
        popup!.style.borderRadius = '12px';
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#5b21b6';
          confirmButton.style.borderRadius = '8px';
          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#4c1d95'; // Color en hover
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#5b21b6'; // Color normal
          };
        }

        if (cancelButton) {
          cancelButton.style.backgroundColor = '#dc2626';
          cancelButton.style.borderRadius = '8px';

          cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#b91c1c'; // Color en hover
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#dc2626'; // Color normal
          };
        }
      },
    }).then((result) => result.isConfirmed);
  }
}
