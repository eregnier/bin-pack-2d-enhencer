Bin packing 2D Optimizer
==================

Dataset is preprocessed with quick shelf algorithm to optimize initial position with a restricted width, then this optimizer will try to move all possible pieces from
the most large ones to smaller one at every possible available position above current position.

It is initially intended to move all possible pieces at bottom to the most top position to let as possible large free spaces at the bottom of the pack, but it
sometimes finds more optimal dispositions of the pack that the Shelve algorithm.

This algorithm is time expansive and has a great complexity. it should be used for small data set to remain practicable or user would have to be patient.
It takes up to 10 second to process a dataset of about 40 pieces. this algorithm is unfortunatly exponential and is quickly unreliable for larger datasets.

Usage:

```javascript

  import Optimizer from 'bin-pack-2d-enhencer'

  let pack = [
    {w: 10, h: 15},
    {w: 20, h: 25},
    {w: 30, h: 35},
  ]

  pack = new Optimizer(pack, 140, 100000).optimize()
  /*
  pack items have now a w(width) and h(height) attributes
  [
    {w: 10, h: 15},
    {w: 20, h: 25},
    {w: 30, h: 35},
  ]
  */
```
