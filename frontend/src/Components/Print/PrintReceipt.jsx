import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import { TemplateReceipt } from './TemplateReceipt';


const PrintReceipt = () => {
  const componentRef = useRef();
  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
        pageStyle={ "@page { width: 80mm; height: 80mm; margin: 0mm auto ; } @media print { body { -webkit-print-color-adjust: exact; } }" }
      />
      <div style={{ display: 'none' }}>
        <TemplateReceipt ref={componentRef} />
      </div>

    </div>
  );
};

export default PrintReceipt;