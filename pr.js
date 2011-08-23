/**
 * Created by Robert kehoe - info@robertkehoe.com
 * See http://www.robertkehoe.com/2011/08/extjs-print_r-dont-leave-home-without-it/ For more details
 * License: MIT
 *
 * Does a PHP print_r() equivalent on a JS variable. Default is to create new Ext.window to output result
 *
 * @param return_val bool if true, returns output as string, if false (default value) creates window and outputs result
 */
function pr (myArray, title) {

  title = title || 'pr() ' + new Date();
  // if you ever need to find a "missing" pr(), just uncomment line below
  // it will add file name and line to page title (may have to change index)
  //title = printStackTrace()[3];

  new Ext.Window({
    height : 400,
    width : 900,
    title : title,
    autoScroll : true,
    html : '<pre>'+print_r(myArray, false, false, '', 6)+'</pre>'
  }).show();
}

/**
 *	getType
 *
 *	Use this when typeof returns 'Object'.
 *
 *	@param mixed $obj The object to investigrate.
 *
 *	@return string The object's constructor.
 *
 *	@author Josh Zerin, Life Blue Media (http://www.lifeblue.com/)
 *	@author Special thanks to:
 *		- gits
 *		- iam_clint
 *		- volectricity
 *		- Purple
 *	http://www.thescripts.com/
 */
function getType($obj)
{
  /***************
   *
   *	Two special cases:  undefined and null.
   */
  if( typeof $obj == 'undefined' )
  {
    return 'undefined';
  }

  if($obj === null)
  {
    return 'null';
  }

  /***************
   *
   *	Run through the standard constructors.
   */
  switch($obj.constructor)
  {
    case Array:
      return 'Array';
    case Boolean:
      return 'Boolean';
    case Date:
      return 'Date';
    case Error:
      return 'Error';
    case Function:
      return 'Function';
    case Number:
      return 'Number';
    case RegExp:
      return 'RegExp';
    case String:
      return 'String';
    default:

      /***************
       *
       *	HTML Elements will have a nodeType property.  It is unlikely, though possible, that other objects will.
       */
      if( typeof($obj.nodeType) != 'undefined' )
      {
        //return 'HTML ' + $obj.nodeName.toUpperCase() + ' Element';
        return 'HTMLObject';

      }

      /***************
       *
       *	If it's not an HTML Element, it might be an Event.
       */
      if($obj.toString)
      {
        if($obj.toString().match('Event'))
        {
          return 'Event';
        }
      }

      /***************
       *
       *	I give up.
       */
      return 'Object';
  }
}

/**
 *
 *	print_r
 *
 *	Similar to the PHP function of the same name, except it always returns its output (I never liked that about PHP's print_r()).
 *
 *	@param mixed $content The variable you're trying to print_r.  Generally an object or array.
 *
 *	@param bool $htmlEncode How to format the output:
 *		- true:		Use <br /> for line breaks, and &nbsp; for tabs.
 *		- false:	Use \n for line breaks and \t for tabs.
 *
 *	@param string $basePrefix The base prefix that will be appended to all lines of output.  Very useful if you need your debug output to all line up (and something that REALLY bugs me about PHP's print_r()!).
 *
 *	@param string $_prefix (internal)
 *
 *	@return string A print_r()'ed string, similar in format to the PHP function of the same name (but with a few enhancements ~_^).
 *
 *	@author Josh Zerin, Life Blue Media (http://www.lifeblue.com/)
 *	@author Special thanks to:
 *		- gits
 *		- iam_clint
 *		- volectricity
 *		- Purple
 *	http://www.thescripts.com/
 */
function print_r($content, $htmlEncode, $basePrefix, $_prefix, levels)
{
  if (!levels)
    levels = 3;

  levels--;

  if (levels == 0)
    return "***-Recursion-***\n";

  /***************
   *
   *	$_prefix must be a string.
   */
  if( ! $_prefix )
  {
    $_prefix = '';
  }

  /***************
   *
   *	Set the $basePrefix if not already set.
   */
  if( ! $basePrefix )
  {
    $basePrefix =
      (
        // If $_prefix is defined, we'll just use that.
        $_prefix
          ? $_prefix
          :
          (
            // Otherwise, use a default.
            $htmlEncode
              ? '&nbsp;&nbsp;&nbsp;&nbsp;'
              : '\t'
            )
        );
  }

  /***************
   *
   *	How do we display newlines?
   */
  var $newLine = ($htmlEncode ? '<br />' : '') + '\n';

  /***************
   *
   *	Init output string.
   */
  var $retVal = '';

  /****************
   *
   *	We don't need to redundantly output certain types (the 'value' of null & undefined are self-explanatory, and we auto-output the type of Array & Object, so we don't want to do it twice).
   */
  var $blacklistDisplayType =
  {
    'null':			true,
    'Array':		true,
    'Object':		true,
    'undefined':	true
  };

  /***************
   *
   *	Begin processing $content.
   */
  var $myType = getType($content);
  var $subType = '';

  //$retVal = $myType +"\n\n";
  /***************
   *
   *	And off we go!
   */
  if( $myType == 'Array' )
  {
    // E.g., "Array:\n\t(\n"
    $retVal += $myType + ':' + $newLine + $_prefix + '(' + $newLine;

    /***************
     *
     *	Save the closing format before we go modifying $_prefix.
     */
    var $close = $_prefix + ')' + $newLine;

    /***************
     *
     *	$basePrefix is only for *child* elements of the array.
     */
    $_prefix += $basePrefix;

    /***************
     *
     *	for...in not useful on Arrays, since that will also return member functions.
     */
    for( var $i = 0; $i < $content.length; ++$i )
    {
      var $innerType = getType($content[$i]);

      // E.g., "\t\t0 => (Number) "
      $retVal += $_prefix + '[' + $i + '] => ' +
        (
        /***************
         *
         *	Should we display the type of the child element?
         */
          $blacklistDisplayType[$innerType]
            ? ''
            : ' (' + getType($content[$i]) + ')'
          ) + ' ';

      /***************
       *
       *	If the child element has children of its own, recursively process them.
       */
      if(($innerType == 'Array') || ($innerType == 'Object'))
      {
        $retVal +=
          print_r
            (
              $content[$i],
              $htmlEncode,
              $basePrefix,
              $_prefix,
              levels
            );
      }
      else
      {
        $retVal += $content[$i] + $newLine;
      }
    }

    // E.g., "\t)\n"
    $retVal += $close;
  }
  else if( $myType == 'Object' )
  {
    $retVal += $myType + ':' + $newLine + $_prefix + '(' + $newLine;
    var $close = $_prefix + ')' + $newLine;
    $_prefix += $basePrefix;

    /***************
     *
     *	for not useful on Objects, since they generally have no length property.
     */
    for( $i in $content )
    {
      var $innerType = getType($content[$i]);
      $retVal += $_prefix + '[' + $i + '] => ' +
        (
          $blacklistDisplayType[$innerType]
            ? ''
            : ' (' + getType($content[$i]) + ')'
          ) + ' ';

      if( ($innerType == 'Array') || ($innerType == 'Object') )
      {
        $retVal +=
          print_r
            (
              $content[$i],
              $htmlEncode,
              $basePrefix,
              $_prefix,
              levels
            );
      }
      else
      {
        $retVal += $content[$i] + $newLine;
      }
    }

    $retVal += $close;
  }
//	else if( $myType == 'HTMLObject' )
//	{
//		if (typeof($content.id) != 'undefined')
//		{
//			$retVal += $myType + ':' + $newLine + $_prefix + '(' + $newLine;
//			var id = ($content.id == null ? $content : $content.id);
//			$retVal += print_r($(id).getProperties());
//		}
//	}
  else
  {

    /***************
     *
     *	If it ain't an object, then it's scalar.
     */
    $retVal += $content;
  }

  /***************
   *
   *	And we're done!
   */
  return $retVal;
}