---
layout: null
---
var rewardsMeApi = "{{ site.rewards_me_api }}";
$(document).ready(function() {
  var $form = $("#UserDataInputForm");
  var $backBtn = $("#UserDataInputFormBack");
  var $seeAllBtn = $("#UserDataInputFormSeeAll");
  $backBtn.hide();
  $seeAllBtn.hide();
  var $formResult = $('#UserDataInputFormResult');
  $formResult.hide();
  var _result = [];
  $form.on( "submit", function( event ) {
    event.preventDefault();
    $form.hide();
    $formResult.html('<p class="text-center">Loading...</p>');
    $formResult.show();
    $.ajax({
      url: rewardsMeApi + '/api/v1/rewards/',
      data:$form.serialize(),
      method: 'GET',
      crossDomain: true,
    }).then(function(result) {
      _result = result;
      render(true);
      $backBtn.show();
      $seeAllBtn.show();
    })
  });

  $backBtn.on( "click", function( event ) {
    $form.show();
    $formResult.hide();
    $backBtn.hide();
    $seeAllBtn.hide();
  });

  $seeAllBtn.on( "click", function( event ) {
    render();
    $seeAllBtn.hide();
  });

  function render(isCompact) {
    if (isCompact) {
      $formResult.html([
        '<h2>First Year Reward Leaders</h2>',
        renderData(_result.sort((a, b) =>  b.firstYearReward - a.firstYearReward).slice(0, 3)),
        '<h2>Two Years Reward Leaders</h2>',
        renderData(_result.sort((a, b) =>  b.twoYearsReward - a.twoYearsReward).slice(0, 3)),
      ].join(''));
    } else {
      $formResult.html([
        '<h2>All Results</h2>',
        renderData(_result.sort((a, b) =>  b.firstYearReward - a.firstYearReward)),
      ].join(''));
    }
  }

  function renderData(data) {
    return [
      '<ul class="feature__wrapper">',
      data.map(function(item) {
        return `
            <li class="feature__item">
              <div class="details">
                <small>Rwrd: ${ item.metadata.rewardRange.min }%-${ item.metadata.rewardRange.max }%</small>
                <small>Bonus: $${ item.metadata.welcomeBonus }</small>
                <small>Fee: $${ item.metadata.followingYearFee }</small>
                <small>${ (item.metadata.followingYearFee && !item.metadata.firstYearFee) ? '1s Year Fee Waived' : '' }</small>
              </div>
              <img alt="${ item.cardName }" src="/assets/images/cards/${ item.bankName.trim() } ${ item.cardName.trim() }.jpg"/>
              <p><strong>${ item.bankName }</strong></p>
              <p>
                ${ item.cardName } <small title="Reward Type: ${ item.metadata.rewardType }">(${ item.metadata.rewardType })</small>
              </p>
              <p>
                <span class="btn" title="First Year Reward" style="background-color: ${hsl(item.firstYearRewardColor)};">
                  $${ Math.round(item.firstYearReward * 100) / 100 }
                </span>
                1st year
                <br />
                <span class="btn" title="Two Years Reward" style="background-color: ${hsl(item.twoYearsRewardColor)};">
                  $${ Math.round(item.twoYearsReward * 100) / 100 }
                </span>
                2 years
              </p>
              <small>${ item.metadata.notes }</small>
            </li>
          `
      }).join(''),
      '</ul>'].join('');
  }

  function hsl(item) {
    return ['hsl(',
      item.h,
      ',',
      item.s,
      ',',
      item.l,
      ')',
    ].join('');
  }
});
