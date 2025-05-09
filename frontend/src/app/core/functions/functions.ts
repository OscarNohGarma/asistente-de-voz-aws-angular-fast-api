export function getLocalISOStringWithMicroseconds(): string {
  const now = new Date();
  const pad = (n: number, width = 2) => n.toString().padStart(width, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());
  const millis = now.getMilliseconds().toString().padStart(3, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millis}000`;
}

export function formatearFechaAlerta(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();

  let horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const segundos = fecha.getSeconds().toString().padStart(2, '0');
  const sufijo = horas >= 12 ? 'p.m.' : 'a.m.';

  horas = horas % 12;
  horas = horas ? horas : 12; // convertir 0 a 12

  return `${dia} de ${mes} de ${año} a las ${horas}:${minutos}:${segundos} ${sufijo}`;
}
