import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "@/assets/images/aeriatrois-logo.png";
import montserratRegularUrl from "@/assets/fonts/Montserrat-Regular.ttf?url";
import montserratBoldUrl from "@/assets/fonts/Montserrat-Bold.ttf?url";

const PDF_FONT_FAMILY = "Montserrat";

/** Base64 del TTF; el vFS de jsPDF es por instancia de documento. */
let montserratFontDataPromise = null;

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function loadMontserratFontData() {
  if (!montserratFontDataPromise) {
    montserratFontDataPromise = (async () => {
      const [regularRes, boldRes] = await Promise.all([
        fetch(montserratRegularUrl),
        fetch(montserratBoldUrl),
      ]);
      if (!regularRes.ok || !boldRes.ok) {
        throw new Error("Montserrat font fetch failed");
      }
      return {
        regular: arrayBufferToBase64(await regularRes.arrayBuffer()),
        bold: arrayBufferToBase64(await boldRes.arrayBuffer()),
      };
    })();
  }
  return montserratFontDataPromise;
}

/** Registra Montserrat en el doc (README jsPDF: addFileToVFS + addFont + setFont). */
async function registerMontserratOnDoc(doc) {
  const { regular, bold } = await loadMontserratFontData();
  doc.addFileToVFS("Montserrat-Regular.ttf", regular);
  doc.addFont("Montserrat-Regular.ttf", PDF_FONT_FAMILY, "normal");
  doc.addFileToVFS("Montserrat-Bold.ttf", bold);
  doc.addFont("Montserrat-Bold.ttf", PDF_FONT_FAMILY, "bold");
}

// Paleta extraída del diseño de referencia
const NAVY = [24, 0, 173]; // título, FECHA, DESTINATARIO
const TABLE_HEADER = [11, 54, 97]; // cabecera de la tabla
const GOLD = [242, 171, 42]; // acento marca (logo, separadores)
const DISCOUNT_BG = GOLD; // fila de descuento
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

/** jsPDF posiciona por baseline; calcula Y de baseline para alinear el borde superior. */
function baselineYForTextTop(doc, topY, fontSizePt) {
  const scale = doc.internal.scaleFactor;
  const ascenderMm =
    (fontSizePt * doc.getLineHeightFactor() * 0.76) / scale;
  return topY + ascenderMm;
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
    let pdfFont = "helvetica";
    try {
      await registerMontserratOnDoc(doc);
      pdfFont = PDF_FONT_FAMILY;
    } catch {
      // jsPDF incluye helvetica; seguimos si Montserrat no carga
    }
    const pageW = doc.internal.pageSize.getWidth();
    const marginX = 18;
    let y = 18;

    // --- Logo + nombre ---
    const logoSize = 30;
    const logoTextGap = 3;
    try {
      const logoImg = await loadImage(logoUrl);
      doc.addImage(logoImg, "PNG", marginX, y, logoSize, logoSize);
    } catch {
      // si el logo no carga, seguimos sin bloquear la descarga
    }

    const brandX = marginX + logoSize + logoTextGap;

    doc.setFont(pdfFont, "bold");
    doc.setFontSize(19);
    doc.setTextColor(...NAVY);
    doc.text("AERIA", brandX, y + 8);
    doc.text("TROIS", brandX, y + 16);

    const brandTextWidth = Math.max(
      doc.getTextWidth("AERIA"),
      doc.getTextWidth("TROIS"),
    );
    const separatorY = y + 18.5;
    const separatorH = 0.9;
    doc.setFillColor(...GOLD);
    doc.rect(brandX, separatorY, brandTextWidth, separatorH, "F");

    doc.setFont(pdfFont, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...NAVY);
    doc.text("GRUPO ARTÍSTICO", brandX, y + 24);

    y += 36;

    const destX = marginX + 95;
    const colGap = 4;
    const titleWidth = destX - marginX - colGap;
    const destWidth = pageW - destX - marginX;
    const metaTopY = y;
    const destLabelSize = 10;
    const titleSize = 17;

    // Título y DESTINATARIO alineados por el borde superior (no por baseline)
    doc.setTextColor(...NAVY);

    doc.setFont(pdfFont, "bold");
    doc.setFontSize(destLabelSize);
    const destLineH = doc.getLineHeight() / doc.internal.scaleFactor;
    const destBaselineY = baselineYForTextTop(doc, metaTopY, destLabelSize);
    doc.text("DESTINATARIO:", destX, destBaselineY);

    doc.setFontSize(titleSize);
    const tituloText = (f.cliente.titulo || "Presupuesto").toUpperCase();
    const titleLines = doc.splitTextToSize(tituloText, titleWidth);
    const titleBaselineY = baselineYForTextTop(doc, metaTopY, titleSize);
    doc.text(titleLines, marginX, titleBaselineY);
    const titleLineH = doc.getLineHeight() / doc.internal.scaleFactor;
    const titleEndY = titleBaselineY + titleLines.length * titleLineH;

    doc.setFontSize(destLabelSize);
    doc.setFont(pdfFont, "normal");
    const destLines = doc.splitTextToSize(f.cliente.nombre || "", destWidth);
    const destContentY = destBaselineY + destLineH;
    doc.text(destLines, destX, destContentY);

    let destEndY = destContentY + destLines.length * destLineH;
    if (f.cliente.evento) {
      const eventoLines = doc.splitTextToSize(f.cliente.evento, destWidth);
      doc.text(eventoLines, destX, destEndY + 1);
      destEndY += eventoLines.length * destLineH + 1;
    }

    // --- Fecha (izquierda, debajo del título) ---
    const fechaY = titleEndY + 6;
    doc.setFont(pdfFont, "bold");
    doc.text("FECHA:", marginX, fechaY);
    doc.setFont(pdfFont, "normal");
    doc.text(formatFecha(f.cliente.fechaEmision), marginX + 16, fechaY);

    const fechaBottomY = fechaY + destLineH;
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

      if (num(opcion.descuentoPct) > 0 && !totals.isManual) {
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

      f.serviciosExtras.forEach((servicio) => {
        const importe = num(servicio.horas) * num(servicio.precioHora);
        if (importe <= 0) {
          return;
        }
        body.push([
          servicio.descripcion,
          String(num(servicio.horas)),
          money(num(servicio.precioHora)),
          money(importe),
        ]);
        rowStyles.push(null);
      });

      body.push([
        {
          content: totals.isManual
            ? "PRECIO CERRADO"
            : "TOTAL DEL PRESUPUESTO",
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
          font: pdfFont,
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
    doc.setFont(pdfFont, "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(f.iva, pageW - marginX, finalY, { align: "right" });

    doc.save(`${(f.cliente.titulo || "presupuesto").replace(/\s+/g, "_")}.pdf`);
  }

  return { exportarPDF };
}
