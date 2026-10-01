import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "@/assets/images/aeriatrois-logo.png";

// Paleta extraída del diseño de referencia
const NAVY = [24, 0, 173]; // título, FECHA, DESTINATARIO
const TABLE_HEADER = [11, 54, 97]; // cabecera de la tabla
const DISCOUNT_BG = [242, 171, 42]; // fila de descuento
const TOTAL_BG = [255, 214, 151]; // fila de total
const WHITE = [255, 255, 255];
const TEXT_DARK = [30, 30, 30];

function num(v) {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}
function money(n) {
  return (
    n.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "€"
  );
}
function formatFecha(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function useBudgetPdf(budget) {
  async function exportarPDF(formBudget = budget.formBudget) {
    const f = formBudget;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const marginX = 18;
    let y = 18;

    // --- Logo + nombre ---
    try {
      const logoImg = await loadImage(logoUrl);
      doc.addImage(logoImg, "PNG", marginX, y, 20, 20);
    } catch {
      // si el logo no carga, seguimos sin bloquear la descarga
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(...NAVY);
    doc.text("AERIA", marginX + 26, y + 8);
    doc.text("TROIS", marginX + 26, y + 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_DARK);
    doc.text("GRUPO ARTÍSTICO", marginX + 26, y + 22);

    y += 34;

    // --- Título del documento ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...NAVY);
    doc.text((f.cliente.titulo || "Presupuesto").toUpperCase(), marginX, y);

    // --- Fecha (izquierda) ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("FECHA:", marginX, y + 12);
    doc.setFont("helvetica", "normal");
    doc.text(formatFecha(f.cliente.fechaEmision), marginX + 16, y + 12);

    // --- Destinatario (derecha) ---
    const destX = marginX + 95;
    const destWidth = pageW - destX - marginX;
    const lineH = doc.getLineHeight() / doc.internal.scaleFactor;
    doc.setFont("helvetica", "bold");
    doc.text("DESTINATARIO:", destX, y - 6);
    doc.setFont("helvetica", "normal");
    const destLines = doc.splitTextToSize(f.cliente.nombre || "", destWidth);
    doc.text(destLines, destX, y);

    let destEndY = y + destLines.length * lineH;
    if (f.cliente.evento) {
      const eventoLines = doc.splitTextToSize(f.cliente.evento, destWidth);
      doc.text(eventoLines, destX, destEndY + 1);
      destEndY += eventoLines.length * lineH + 1;
    }

    const fechaBottomY = y + 12 + lineH;
    y = Math.max(fechaBottomY, destEndY) + 8;

    const pageH = doc.internal.pageSize.getHeight();

    f.opciones.forEach((opcion, optionIndex) => {
      const totals = budget.optionTotals[optionIndex];
      const body = [];
      const rowStyles = [];

      opcion.lineas.forEach((l) => {
        body.push([
          l.name,
          String(num(l.units)),
          money(num(l.unitPrice)),
          money(num(l.units) * num(l.unitPrice)),
        ]);
        rowStyles.push(null);
      });

      if (num(opcion.descuentoPct) > 0) {
        body.push([
          {
            content: `${opcion.descuentoPct}% DE DESCUENTO POR VARIOS PASES`,
            colSpan: 3,
          },
          money(totals.discounted),
        ]);
        rowStyles.push("discount");
      }

      if (f.dietas.activo) {
        const dias = num(f.dietas.dias) || 1;
        body.push([
          `Dietas ${dias} día${dias === 1 ? "" : "s"}, ${f.dietas.personas} persona${num(f.dietas.personas) === 1 ? "" : "s"}`,
          String(num(f.dietas.personas) * dias),
          money(num(f.dietas.precio)),
          money(budget.dietasTotal),
        ]);
        rowStyles.push(null);
      }

      if (f.transporte.activo) {
        const uds = f.transporte.idaVuelta ? 2 : 1;
        const precioTrayecto = num(f.transporte.km) * num(f.transporte.precio);
        body.push([
          `Plus transporte ${f.transporte.km}km (${num(f.transporte.precio)}€/km)${f.transporte.idaVuelta ? " — ida y vuelta" : ""}`,
          String(uds),
          money(precioTrayecto),
          money(budget.transporteTotal),
        ]);
        rowStyles.push(null);
      }

      if (f.alojamiento.activo) {
        body.push([
          "Alojamiento",
          String(num(f.alojamiento.unidades)),
          money(num(f.alojamiento.precio)),
          money(budget.alojamientoTotal),
        ]);
        rowStyles.push(null);
      }

      body.push([
        {
          content: "TOTAL DEL PRESUPUESTO",
          colSpan: 3,
          styles: { halign: "center" },
        },
        money(totals.total),
      ]);
      rowStyles.push("total");

      if (y > pageH - 40) {
        doc.addPage();
        y = 18;
      }

      autoTable(doc, {
        startY: y,
        margin: { left: marginX, right: marginX },
        head: [
          [
            `OPCIÓN ${optionIndex + 1} - DESCRIPCIÓN DEL SERVICIO A REALIZAR`,
            "UDS",
            "€/UD",
            "PRECIO",
          ],
        ],
        body,
        theme: "plain",
        styles: {
          font: "helvetica",
          fontSize: 9.5,
          cellPadding: 3,
          textColor: TEXT_DARK,
          lineColor: [235, 235, 235],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: TABLE_HEADER,
          textColor: WHITE,
          fontStyle: "bold",
          halign: "left",
        },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 16, halign: "center" },
          2: { cellWidth: 24, halign: "right" },
          3: { cellWidth: 26, halign: "right", fontStyle: "bold" },
        },
        didParseCell(data) {
          if (data.section !== "body") {
            return;
          }
          const kind = rowStyles[data.row.index];
          if (kind === "discount") {
            data.cell.styles.fillColor = DISCOUNT_BG;
            data.cell.styles.fontStyle = "bold";
          }
          if (kind === "total") {
            data.cell.styles.fillColor = TOTAL_BG;
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fontSize = 10.5;
          }
        },
      });

      y = doc.lastAutoTable.finalY + 8;
    });

    // --- IVA ---
    let finalY = y + 2;
    if (finalY > pageH - 12) {
      doc.addPage();
      finalY = 18;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(f.iva, pageW - marginX, finalY, { align: "right" });

    doc.save(`${(f.cliente.titulo || "presupuesto").replace(/\s+/g, "_")}.pdf`);
  }

  return { exportarPDF };
}
