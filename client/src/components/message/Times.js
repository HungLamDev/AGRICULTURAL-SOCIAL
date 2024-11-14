import React from 'react'

const Times = ({total}) => {
  const validTotal = isNaN(total) ? 0 : total;

    return (
        <div>
            <span>
                {
                    (parseInt(validTotal/3600)).toString().length < 2
                    ? '0' + (parseInt(validTotal/3600))
                    : (parseInt(validTotal/3600))
                }
            </span>
            <span>:</span>

            <span>
                {
                    (parseInt(validTotal/60)).toString().length < 2
                    ? '0' + (parseInt(validTotal/60))
                    : (parseInt(validTotal/60))
                }
            </span>
            <span>:</span>

            <span>
                {
                    (validTotal%60).toString().length < 2
                    ? '0' + (validTotal%60) + 's'
                    : (validTotal%60) + 's'
                }
            </span>
        </div>
    )
}

export default Times