import { describe, expect, it } from 'vitest'
import { calculateReceipt } from './receipt-calculator'

/**
 * Asserts two amounts are equal within floating point tolerance.
 *
 * @param actual Actual amount.
 * @param expected Expected amount.
 */
function assertAmount(actual: number, expected: number): void {
  expect(actual).toBeCloseTo(expected, 6)
}

describe('calculateReceipt', () => {
  it('matches total bill amount to summed individual diner totals', () => {
    const receipt = calculateReceipt({
      adjustments: [{ amount: 9, id: 1, label: 'Tip' }],
      diners: [
        {
          id: 1,
          items: [{ amount: 40, id: 1, name: 'Steak' }],
          name: 'Alice',
        },
        {
          id: 2,
          items: [{ amount: 20, id: 2, name: 'Pasta' }],
          name: 'Bob',
        },
      ],
      discount: { amount: 4, unit: 'fixed' },
      serviceRate: 10,
      sharedItems: [
        {
          amount: 30,
          id: 3,
          name: 'Wine',
          participantIds: [1, 2],
        },
      ],
      taxRate: 7,
    })

    const dinerTotal = receipt.diners.reduce((total, diner) => total + diner.total, 0)

    assertAmount(receipt.subtotal, 90)
    assertAmount(receipt.service, 9)
    assertAmount(receipt.tax, 6.93)
    assertAmount(receipt.adjustments, 9)
    assertAmount(receipt.discount, 4)
    assertAmount(receipt.total, 110.93)
    assertAmount(dinerTotal, receipt.total)
  })

  it('calculates individual subtotal, service, tax, and fees from each diner subtotal', () => {
    const receipt = calculateReceipt({
      adjustments: [],
      diners: [
        {
          id: 1,
          items: [{ amount: 80, id: 1, name: 'Tasting Menu' }],
          name: 'Alice',
        },
        {
          id: 2,
          items: [{ amount: 40, id: 2, name: 'Risotto' }],
          name: 'Bob',
        },
      ],
      discount: { amount: 0, unit: 'fixed' },
      serviceRate: 12.5,
      sharedItems: [],
      taxRate: 20,
    })

    const alice = receipt.diners[0]
    const bob = receipt.diners[1]

    expect(alice).toBeDefined()
    expect(bob).toBeDefined()

    if (!alice || !bob) {
      return
    }

    assertAmount(alice.subtotal, 80)
    assertAmount(alice.service, 10)
    assertAmount(alice.tax, 18)
    assertAmount(alice.fees, 28)
    assertAmount(alice.total, 108)
    assertAmount(bob.subtotal, 40)
    assertAmount(bob.service, 5)
    assertAmount(bob.tax, 9)
    assertAmount(bob.fees, 14)
    assertAmount(bob.total, 54)
    assertAmount(alice.total + bob.total, receipt.total)
  })

  it('allocates fixed adjustments and discounts equally', () => {
    const receipt = calculateReceipt({
      adjustments: [{ amount: 12, id: 1, label: 'Corkage' }],
      diners: [
        {
          id: 1,
          items: [{ amount: 90, id: 1, name: 'Lobster' }],
          name: 'Alice',
        },
        {
          id: 2,
          items: [{ amount: 30, id: 2, name: 'Salad' }],
          name: 'Bob',
        },
      ],
      discount: { amount: 10, unit: 'fixed' },
      serviceRate: 0,
      sharedItems: [],
      taxRate: 0,
    })

    const alice = receipt.diners[0]
    const bob = receipt.diners[1]

    expect(alice).toBeDefined()
    expect(bob).toBeDefined()

    if (!alice || !bob) {
      return
    }

    assertAmount(alice.adjustments, 6)
    assertAmount(bob.adjustments, 6)
    assertAmount(alice.discount, 5)
    assertAmount(bob.discount, 5)
    assertAmount(alice.total, 91)
    assertAmount(bob.total, 31)
    assertAmount(alice.total + bob.total, receipt.total)
  })

  it('applies percentage discounts proportionally and preserves total equality', () => {
    const receipt = calculateReceipt({
      adjustments: [{ amount: 10, id: 1, label: 'Corkage' }],
      diners: [
        {
          id: 1,
          items: [{ amount: 50, id: 1, name: 'Fish' }],
          name: 'Alice',
        },
        {
          id: 2,
          items: [{ amount: 50, id: 2, name: 'Duck' }],
          name: 'Bob',
        },
      ],
      discount: { amount: 10, unit: 'percentage' },
      serviceRate: 10,
      sharedItems: [],
      taxRate: 10,
    })

    const dinerTotal = receipt.diners.reduce((total, diner) => total + diner.total, 0)

    assertAmount(receipt.total, 117.9)
    assertAmount(receipt.discount, 13.1)
    assertAmount(dinerTotal, receipt.total)
  })
})
