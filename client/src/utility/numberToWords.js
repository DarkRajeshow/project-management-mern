export default function numberToWords(num) {
    if (num === 0) return 'ZERO';

    const belowTwenty = [
        'ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN',
        'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
    ];

    const tens = [
        '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'
    ];

    const thousands = [
        '', 'THOUSAND', 'MILLION', 'BILLION', 'TRILLION'
    ];

    const wordHelper = (n) => {
        if (n < 20) return belowTwenty[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 === 0 ? '' : ' ' + belowTwenty[n % 10]);
        if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 === 0 ? '' : ' ' + wordHelper(n % 100));
        return '';
    };

    let result = '';
    let thousandCounter = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            result = wordHelper(num % 1000) + (thousands[thousandCounter] ? ' ' + thousands[thousandCounter] : '') + (result ? ' ' + result : '');
        }
        num = Math.floor(num / 1000);
        thousandCounter++;
    }

    return result.trim();
}